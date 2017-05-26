import { Class } from 'meteor/jagi:astronomy';
import { Mongo } from 'meteor/mongo';

// A note has only a body and may be attached to any item
// which inherits properties from the GenericDashObject
const Note = Class.create({
	name: 'Note',
	fields: {
		body: String // The text of the note
	}
});

// The generic class which other objects inherit
// It will be useful for just about everything stored here
// to keep track of when it was created, when it was updated,
// and to take notes on that object
const GenericDashObject = Class.create({
	name: 'Generic Dash Object',
	typeField: 'type',
	fields: {
		notes: {
			type: [Note], // An array of notes about the object
			default: () => [] // Default to being an empty array
		},
		createdAt: {
			type: Date,
			// immutable: true
			// Should be immutable, but a bug makes the field disappear
		},
		updatedAt: Date
	},
	events: {
		beforeInsert (event) {
			// Assigns the createdAt property automatically before insertion into the database
			event.currentTarget.createdAt = new Date();
		},
		beforeSave (event) {
			// Assigns the createdAt property automatically every time the object is saved
			event.currentTarget.updatedAt = new Date();
		}
	}
});

// A physicalAddress is a real location that may be assigned to a client or property.
// The field names below are schema.org conventions that are country-agnostic
const PhysicalAddress = GenericDashObject.inherit({
	name: 'Physical Address',
	fields: {
		addressLocality: String, // i.e. city
		addressRegion: String, // i.e. state
		streetAddress: String,
		postalCode: String, // i.e. ZIP
		// field for connecting to API endpoint, like google maps object ID, freebase, &c
	}
});

// An emailAddress is an email address associated with a client or property
// It may contain a link to a credential for logging into it
const EmailAddress = GenericDashObject.inherit({
	name: 'Email Address',
	fields: {
		address: String, // TODO validation
		domain: {
			// A transient property storing the domain of the address
			type: String,
			transient: true,
			resolve (doc) {
				// There's only one @ in an email address
				return doc.address.split('@')[1];
			}
		},
		credentialId: {
			type: String,
			optional: true
		}
	},
	helpers: {
		credential () {
			var credential = undefined;
			if(this.credentialId) {
				credential = Credential.findOne(this.credentialId);
			} else {
				// If no credential associated, help the user by creating a blank one
				// It won't save because there is no password field
				credential = new Credential({
					url: this.domain,
					credentialType: CredentialType.EMAIL
				});
			}
			return credential;
		}
	}
});

// A phoneNumber is a phone number associated with a client or property
const PhoneNumber = GenericDashObject.inherit({
	name: 'Phone Number',
	fields: {
		tel: String // The string of numbers constituting the phone number
	}
});


export { Note, GenericDashObject, PhysicalAddress, EmailAddress, PhoneNumber };
