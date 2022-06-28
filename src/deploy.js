import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

import fetch from 'node-fetch';

(async () => {
    // Client Credentials Grant
    
    const rawRes = await fetch('https://discord.com/api/v10/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET, 'utf-8').toString('base64'),
        },
        body: new URLSearchParams({
            grant_type: "client_credentials", 
            scope: "applications.commands.update"
        }).toString()
    });
    const res = await rawRes.json();
    
    
    // Deploying Commands
    
    const data = await import('/app/data/commands.js');
    const code = res.access_token;
    const rest = new REST({ version: '9', authPrefix: 'Bearer' }).setToken(code);
    
    try {
        console.log('Started refreshing application (/) commands.');
		await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: data.commands });
		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	};
})();