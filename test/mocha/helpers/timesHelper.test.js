const chai = require('chai');
const moment = require('moment-timezone');

const timesHelper = require('../../../helpers/timesHelper');

const defaultTimezone = 'Europe/Berlin';
const testDate = new Date(Date.UTC(2020, 10, 1, 1, 0));

const getMockRes = (timezone) => ({ locals: { currentSchoolData: { timezone } } });
const getMockReq = (timezone) => ({ cookies: { USER_TIMEZONE: { timezone } } });

const setSchoolTimezone = (schoolTimezone) => {
	const mockRes = getMockRes(schoolTimezone);
	const mockReq = getMockReq(schoolTimezone);
	timesHelper.setDefaultTimezone(mockReq, mockRes);
};

describe('times helpers test', () => {
	beforeEach(() => {
		moment.locale('en');
		moment.tz.setDefault(defaultTimezone);
	});

	it('Check for default UTC offset', () => {
		chai
			.expect(timesHelper.getUtcOffset())
			.to.equal(
				'+02:00',
				`The default offset for ${defaultTimezone} should be +02:00`,
			);
	});

	it('set school timezone as default', () => {
		const schoolTimezone = 'America/Los_Angeles';
		const schoolTimezoneOffset = '-07:00';
		const mockRes = getMockRes(schoolTimezone);
		const mockReq = getMockReq(schoolTimezone);

		timesHelper.setDefaultTimezone(mockReq, mockRes);
		chai.expect(mockRes.locals.currentTimezone)
			.to.equal(schoolTimezone, `The default timezone should be equal to ${schoolTimezone}`);
		chai.expect(mockRes.locals.currentTimezoneOffset)
			.to.equal(schoolTimezoneOffset, `The default timezone offset should be equal to ${schoolTimezoneOffset}`);
	});

	it('should correctly split date', () => {
		setSchoolTimezone('America/Los_Angeles');
		const expectedDate = {
			timestamp: 1604192400000,
			date: '31.10.2020',
			time: '18:00(UTC-07:00)',
		};
		const dateFormat = 'DD.MM.YYYY';
		const resultDate = timesHelper.splitDate(testDate, dateFormat);
		chai.expect(resultDate.timestamp)
			.to.equal(expectedDate.timestamp);
		chai.expect(resultDate.time)
			.to.equal(expectedDate.time);
		chai.expect(resultDate.date)
			.to.equal(expectedDate.date);
	});

	it('should properly format date', () => {
		const testFormat = 'DD.MM.YYYY HH:mm';
		setSchoolTimezone('America/Los_Angeles');
		const resultDate = timesHelper.formatDate(testDate, testFormat);
		chai.expect(resultDate)
			.to.equal('31.10.2020 18:00');

		const resultDate2 = timesHelper.formatDate(testDate, testFormat, true);
		chai.expect(resultDate2)
			.to.equal('31.10.2020 18:00(UTC-07:00)');
	});

	it('should correctly clone UTC date', () => {
		setSchoolTimezone('America/Los_Angeles');
		const resultDate = timesHelper.cloneUtcDate(testDate);
		chai.expect(resultDate.toISOString(true))
			.to.equal('2020-11-01T01:00:00.000-07:00');
	});

	it('should correctly display time string', () => {
		const testFormat = 'MM/DD/YYYY HH:mm';
		const timeToString = timesHelper.timeToString(testDate, testFormat, false);
		chai.expect(timeToString).to.equal('11/01/2020 02:00');
	});

	it('should correctly display time string from now', () => {
		const testFormat = 'MM/DD/YYYY HH:mm';
		const tomorrow = moment().add(1, 'day').toDate();
		const timeToTomorrow = timesHelper.timeToString(tomorrow, testFormat);
		chai.expect(timeToTomorrow).to.equal('in a day');
	});
});