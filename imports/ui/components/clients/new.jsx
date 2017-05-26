import React from 'react';
import { Client } from '/imports/api/clients';
import { handleError } from '/imports/ui/helpers';

const ClientNew = ({ history }) => (
	<form
		id="clientNew"
		onSubmit={event => {
			event.preventDefault();
			const client = new Client({
				name: $(event.target).find('[name=name]').val()
			});
			Meteor.call('/clients/save', client, (error, clientId) => {
				handleError(error).then(() => {
					history.push(`/clients/${clientId}`);
				});
			});
		}}>
		<input type="text" name="name" placeholder="Client Name" />
		<input type="submit" value="Save" />
	</form>
);

export default ClientNew;
