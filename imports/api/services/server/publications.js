import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Service } from '/imports/api/services';

Meteor.publish('/services/list', () => Service.find());

Meteor.publish('/services/view', service => {
	if(typeof service === 'string') service = Service.findOne(service);
	const cursors = [];
	cursors.push(service.properties());
	cursors.push(Service.find(service._id));
	return cursors;
});
