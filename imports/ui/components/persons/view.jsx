import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';
import { Person, PersonRole } from '/imports/api/persons';
import { handleError } from '/imports/ui/helpers';
import container from '/imports/ui/modules/container';
import { PhysicalAddressList } from '/imports/ui/components/helpers/physicalAddress';
import { EmailAddressList } from '/imports/ui/components/helpers/emailAddress';
import { PhoneNumberList } from '/imports/ui/components/helpers/phoneNumber';

class PersonView extends React.Component {
	render () {
		const person = this.props.person;
		return (
			<div className="person person--view">
				<h1>{person.name}</h1>
				<div className="card card__clients">
					<h2><i className="mdi mdi-account"></i>Clients</h2>
					<ul className="list list__clients">
						{person.clients().fetch().map(client => <li key={client._id}><Link to={client.url}>{client.name}</Link></li>)}
					</ul>
				</div>
				<div className="card card__properties">
					<h2><i className="mdi mdi-clipboard-account"></i>Properties</h2>
					<ul className="list list__properties">
						{person.properties().fetch().map(property => <li key={property._id}><Link to={property.url}>{property.name}</Link></li>)}
					</ul>
				</div>
				<div className="card card__physicalAddresses">
					<h2><i className="mdi mdi-map-marker"></i>Physical Addresses</h2>
					<PhysicalAddressList
						physicalAddresses={person.uniquePhysicalAddresses}
						onUpdate={(physicalAddress, index) => person.callMethod('updatePhysicalAddress', physicalAddress, index, error => handleError(error))}
						onAdd={physicalAddress => person.callMethod('addPhysicalAddress', physicalAddress, error => handleError(error))}
						onDelete={index => person.callMethod('removePhysicalAddress', index)}
					/>
				</div>
				<div className="card card__emailAddresses">
					<h2><i className="mdi mdi-email"></i>Email Addresses</h2>
					<EmailAddressList
						emailAddresses={person.uniqueEmailAddresses}
						onUpdate={(emailAddress, index) => person.callMethod('updateEmailAddress', emailAddress, index, error => handleError(error))}
						onAdd={emailAddress => person.callMethod('addEmailAddress', emailAddress, error => handleError(error))}
						onDelete={index => person.callMethod('removeEmailAddress', index)}
					/>
				</div>
				<div className="card card__phoneNumbers">
					<h2><i className="mdi mdi-phone"></i>Phone Numbers</h2>
					<PhoneNumberList
						phoneNumbers={person.uniquePhoneNumbers}
						onUpdate={(phoneNumber, index) => person.callMethod('updatePhoneNumber', phoneNumber, index, error => handleError(error))}
						onAdd={phoneNumber => person.callMethod('addPhoneNumber', phoneNumber, error => handleError(error))}
						onDelete={index => person.callMethod('removePhoneNumber', index)}
					/>
				</div>
			</div>
		);
	}
};

export default container(({match}, onData) => {
	const personId = match.params.personId;
	const subscription = Meteor.subscribe('/persons/view', personId);
	if(subscription.ready()) {
		const person = Person.findOne(personId);
		onData(null, {person, subscription});
	}
}, PersonView);