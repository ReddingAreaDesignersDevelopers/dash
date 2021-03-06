import React from 'react';
import { Link } from 'react-router-dom';
import chroma from 'chroma-js';
import ColorPicker from 'react-color-picker';
import PropTypes from 'prop-types';

import Property, { PropertyType, PropertyStatus, StyleColor, StyleTypeface, StyleFont } from '/imports/api/Property';
import Service from '/imports/api/Service';

import CredentialList from '/imports/ui/components/Credential/List';
import PersonList from '/imports/ui/components/Person/List';
import { PhysicalAddressList } from '/imports/ui/components/helpers/physicalAddress';
import { EmailAddressList } from '/imports/ui/components/helpers/emailAddress';
import { PhoneNumberList } from '/imports/ui/components/helpers/phoneNumber';

import container from '/imports/ui/modules/container';
import { handleError, Renamer, Select } from '/imports/ui/helpers';

const PropertyTypeSelect = ({ property }) => (
	<Select
		name="type"
		value={property.propertyType}
		clearable={false}
		options={PropertyType.getIdentifiers().map(propertyType => Object({
			value: PropertyType[propertyType],
			label: propertyType.toLowerCase()
		}))}
		onChange={selectedOption => {
			property.propertyType = Number(selectedOption.value);
			Meteor.call('/properties/save', property, error => handleError(error));
		}}
	/>
);

PropertyTypeSelect.propTypes = {
	property: PropTypes.instanceOf(Property)
};

PropertyTypeSelect.defaultProps = {
	property: new Property()
};

const PropertyStatusSelect = ({ property }) => (
	<Select
		name="status"
		value={property.status}
		clearable={false}
		options={PropertyStatus.getIdentifiers().map(propertyStatus => Object({
			value: PropertyStatus[propertyStatus],
			label: propertyStatus.toLowerCase()
		}))}
		onChange={selectedOption => {
			property.status = Number(selectedOption.value);
			Meteor.call('/properties/save', property, error => handleError(error));
		}}
	/>
);

PropertyStatusSelect.propTypes = {
	property: PropTypes.instanceOf(Property)
};

PropertyStatusSelect.defaultProps = {
	property: new Property()
};

const PropertyServiceSelect = ({ property }) => (
	<Select
		name="service"
		multi={true}
		value={property.serviceIds}
		options={Service.find().fetch().map(service => Object({value: service._id, label: service.name}))}
		onChange={selectedOptions => {
			property.serviceIds = selectedOptions.map(option => option.value);
			Meteor.call('/properties/save', property, error => handleError(error));
		}}
	/>
);

PropertyServiceSelect.propTypes = {
	property: PropTypes.instanceOf(Property)
};

PropertyServiceSelect.defaultProps = {
	property: new Property()
};

const StyleFontComponent = ({ font, index, onChange, onRemove }) => (
	<div className="font">
		<input
			type="text"
			name="size"
			defaultValue={font.size}
			placeholder="size"
			onChange={event => {
				font.size = event.target.value;
				onChange(font, index);
			}}
		/>
		<input
			type="text"
			name="weight"
			defaultValue={font.weight}
			placeholder="weight"
			onChange={event => {
				font.weight = event.target.value;
				onChange(font, index);
			}}
		/>
		<input
			type="text"
			name="style"
			defaultValue={font.style}
			placeholder="style"
			onChange={event => {
				font.style = event.target.value;
				onChange(font, index);
			}}
		/>
		<button title="Remove Font" className="remover" onClick={event => onRemove(index)}><i className="mdi mdi-delete"></i></button>
	</div>
);

StyleFontComponent.propTypes = {
	font: PropTypes.instanceOf(StyleFont),
	index: PropTypes.number,
	onChange: PropTypes.func,
	onRemove: PropTypes.func
};

StyleFontComponent.defaultProps = {
	font: new StyleFont(),
	index: 0,
	onChange: () => {},
	onRemove: () => {}
};

const StyleTypefaceComponent = ({ typeface, index, onChange, onRemove, onCreateFont, onRemoveFont }) => (
	<div className="typeface">
		<h3><Renamer object={typeface} onSubmit={typeface => {
			onChange(typeface, index);
		}} /></h3>
		<ul className="font">
			{typeface.fonts.map((font, index) => <li key={index}>
				<StyleFontComponent
					font={font}
					index={index}
					onChange={(font, index) => {
						typeface.fonts[index] = font;
						onChange(typeface, index);
					}}
					onRemove={index => onRemoveFont(index)}
				/>
			</li>
			)}
			<li><button title="Add Font" className="creater" onClick={event => onCreateFont(index)}><i className="mdi mdi-plus"></i><i className="mdi mdi-format-bold"></i></button></li>
		</ul>
		<button title="Remove Typeface" className="remover" onClick={event => onRemove(index)}><i className="mdi mdi-delete"></i></button>
	</div>
);

StyleTypefaceComponent.propTypes = {
	typeface: PropTypes.instanceOf(StyleTypeface),
	index: PropTypes.number,
	onChange: PropTypes.func,
	onRemove: PropTypes.func,
	onCreateFont: PropTypes.func,
	onRemoveFont: PropTypes.func
};

StyleTypefaceComponent.defaultProps = {
	typeface: new StyleTypeface(),
	index: 0,
	onChange: () => {},
	onRemove: () => {},
	onCreateFont: () => {},
	onRemoveFont: () => {}
};

class StyleColorComponent extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			isPicking: false
		};
	}

	static propTypes = {
		color: PropTypes.instanceOf(StyleColor),
		onChange: PropTypes.func,
		onRemove: PropTypes.func
	}

	static defaultProps = {
		color: new StyleColor(),
		onChange: () => {},
		onRemove: () => {}
	}

	setColor (string) {
		this.props.color.value = this.colorInput.value = string;
		this.props.onChange(this.props.color, this.props.index);
	}

	render () {
		return (
			<figure className={`color ${chroma(this.props.color.value).luminance() > .5 ? 'color--light' : 'color--dark'}`} style={{backgroundColor: this.props.color.value}}>
				<figcaption onClick={event => {
					this.setState({isPicking: !this.state.isPicking});
					this.colorInput = this.props.color.value;
				}}>
					<input
						type="text"
						ref={colorInput => this.colorInput = colorInput}
						defaultValue={this.props.color.value}
						onClick={event => event.target.select()}
						onChange={event => {
							this.setColor(event.target.value);
						}} />
				</figcaption>
				{this.state.isPicking
					? <ColorPicker
							defaultValue={this.props.color.value}
							onDrag={string => {
								// If dragging, just simulate the change
								this.props.color.value = string;
							}}
							onChange={string => {
								// When letting up, save the change
								this.setColor(string);
							}}
						/>
					: null
				}
				<button title="Remove Color" className="remover" onClick={event => this.props.onRemove(this.props.index)}><i className="mdi mdi-delete"></i></button>
			</figure>
		);
	}
}

const PropertyStyleComponent = ({ property }) => (
	<div className="style">
		<h2><i className="mdi mdi-format-color-fill"></i>Colors</h2>
		<ul className="color">
			{property.style.colors.map(
				(color, index) => <li key={color.value}>
					<StyleColorComponent
						index={index}
						color={color}
						onChange={(color, index) => {
							property.style.colors[index] = color;
							Meteor.call('/properties/save', property, error => handleError(error));
						}}
						onRemove={index => {
							property.style.colors.splice(index, 1);
							Meteor.call('/properties/save', property, error => handleError(error));
						}}
					/>
				</li>
				)}
			<li><button title="Add Color" className="creater" onClick={event => {
				event.preventDefault();
				property.style.colors.push(new StyleColor());
				Meteor.call('/properties/save', property, error => handleError(error));
			}}><i className="mdi mdi-plus"></i><i className="mdi mdi-format-color-fill"></i></button></li>
		</ul>
		<h2><i className="mdi mdi-format-font"></i>Typefaces</h2>
		<ul className="typeface">
			{property.style.typefaces.map(
				(typeface, index) => <li key={typeface.name}>
					<StyleTypefaceComponent
						typeface={typeface}
						index={index}
						onChange={(typeface, index) => {
							property.style.typefaces[index] = typeface;
							Meteor.call('/properties/save', property, error => handleError(error));
						}}
						onRemove={index => {
							property.style.typefaces.slice(index, 1);
							Meteor.call('/properties/save', property, error => handleError(error));
						}}
						onCreateFont={index => {
							property.style.typefaces[index].fonts.push(new StyleFont());
							Meteor.call('/properties/save', property, error => handleError(error));
						}}
						onRemoveFont={fontIndex => {
							property.style.typefaces[index].fonts.splice(fontIndex, 1);
							Meteor.call('/properties/save', property, error => handleError(error));
						}}
					/>
				</li>
			)}
			<li><button title="Add Typeface" className="creater" onClick={event => {
				property.style.typefaces.push(new StyleTypeface({name: 'New Typeface'}));
				Meteor.call('/properties/save', property, error => handleError(error));
			}}><i className="mdi mdi-plus"></i><i className="mdi mdi-format-font"></i></button></li>
		</ul>
	</div>
);

PropertyStyleComponent.propTypes = {
	property: PropTypes.instanceOf(Property)
};

PropertyStyleComponent.defaultProps = {
	property: new Property()
};


class PropertyView extends React.Component {

	static propTypes = {
		property: PropTypes.instanceOf(Property),
		subscription: PropTypes.object
	}

	static defaultProps = {
		property: new Property(),
		subscription: {}
	}

	resubscribe (component) {
		// A little song and dance because the container doesn't quite stay reactive
		component.props.subscription.stop();
		component.props.subscription = Meteor.subscribe('/properties/view', component.props.property._id);
	}

	render() {
		const property = this.props.property;
		return (
			<div className="property view">
				<h1>
					<Renamer
						object={property}
						onSubmit={property => Meteor.call('/properties/save', property, error => handleError(error))}
					/>
				</h1>
				<Link to={property.client().url}>Property of {property.client().name}</Link>

				<PropertyServiceSelect property={property} />

				<PropertyTypeSelect property={property} />

				<PropertyStatusSelect property={property} />

				<PropertyStyleComponent property={property} />

				<div className="credential card">
					<h2><i className="mdi mdi-key"></i>Credentials</h2>
					<CredentialList
						credentials={property.credentials().fetch()}
						onAdd={credentialId => property.callMethod('addCredential', credentialId, error => handleError(error).then(() => {this.resubscribe(this)}))}
						onDelete={credentialId => property.callMethod('removeCredential', credentialId, handleError)}
					/>
				</div>

				<div className="physical-address card">
					<h2><i className="mdi mdi-map-marker"></i>Physical Addresses</h2>
					<PhysicalAddressList
						physicalAddresses={property.uniquePhysicalAddresses}
						onAdd={physicalAddress => property.callMethod('addPhysicalAddress', physicalAddress, handleError)}
						onUpdate={(physicalAddress, index) => property.callMethod('updatePhysicalAddress', physicalAddress, index, handleError)}
						onDelete={index => property.callMethod('removePhysicalAddress', index, handleError)}
					/>
					{property.client().uniquePhysicalAddresses.length
						? <div className="inherited">
								<h3>Physical Addresses from <Link to={property.client().url}>{property.client().name}</Link></h3>
								<PhysicalAddressList readonly physicalAddresses={property.client().uniquePhysicalAddresses} />
							</div>
						: null
					}
				</div>

				<div className="email-address card">
					<h2><i className="mdi mdi-email"></i>Email Addresses</h2>
					<EmailAddressList
						emailAddresses={property.uniqueEmailAddresses}
						onAdd={emailAddress => property.callMethod('addEmailAddress', emailAddress, handleError)}
						onUpdate={(emailAddress, index) => property.callMethod('updateEmailAddress', emailAddress, index, handleError)}
						onDelete={index => property.callMethod('removeEmailAddress', index, handleError)}
					/>
					{property.client().uniqueEmailAddresses.length
						? <div className="inherited">
								<h3>Email Address from <Link to={property.client().url}>{property.client().name}</Link></h3>
								<EmailAddressList readonly emailAddresses={property.client().uniqueEmailAddresses} />
							</div>
						: null
					}
				</div>

				<div className="phone-number card">
					<h2><i className="mdi mdi-phone"></i>Phone Numbers</h2>
					<PhoneNumberList
						phoneNumbers={property.uniquePhoneNumbers}
						onAdd={phoneNumber => property.callMethod('addPhoneNumber', phoneNumber, handleError)}
						onUpdate={(phoneNumber, index) => property.callMethod('updatePhoneNumber', phoneNumber, index, handleError)}
						onDelete={index => property.callMethod('removePhoneNumber', index, handleError)}
					/>
					{property.client().uniquePhoneNumbers.length
						? <div className="inherited">
								<h3>Phone Numbers from <Link to={property.client().url}>{property.client().name}</Link></h3>
								<PhoneNumberList readonly phoneNumbers={property.client().uniquePhoneNumbers} />
							</div>
						: null
					}
				</div>

				<div className="person card">
					<h2><i className="mdi mdi-account-multiple"></i>People</h2>
					<PersonList
						persons={property.persons().fetch()}
						roleAt={property}
					/>
				</div>
			</div>
		);
	}
}

export default container(({match}, onData) => {
	const propertyId = match.params.propertyId;
	const subscription = Meteor.subscribe('/properties/view', propertyId);

	if(subscription.ready()) {
		const property = Property.findOne(propertyId);
		onData(null, {property, subscription});
	}
}, PropertyView);
