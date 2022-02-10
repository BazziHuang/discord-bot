// ----- Require the necessary discord.js classes -----
const fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');
const { token } = require('./config.json');

// ----- Create a new client instance -----
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles){
    const event = require(`./events/${file}`);
    if(event.once){
        client.once(event.name, (...args) => event.execute(...args));
    }else{
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for ( const file of commandFiles){
    const command = require(`./commands/${file}`);
    // -- Set a new item in the Collection --
    // -- With the key as the command name and the value as the exported module --
    client.commands.set(command.data.name, command); 
}

// ----- When the client is ready, run this code (only once) -----
/*
client.once('ready', c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});
*/

client.on('interactionCreate', async interaction => {
    //console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interation.`);
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if(!command) return;

    try{
        await command.execute(interaction);
    }catch(error){
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });

    }
/*
    const { commandName } = interaction;

    if( commandName === 'ping'){
        await interaction.reply('pong!');
    }else if ( commandName === 'server'){
        await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}\nServer created date: ${interaction.guild.createdAt}\nServer's verification level: ${interaction.guild.verificationLevel}`);
    }else if ( commandName === 'user'){
        await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
    }
*/
  
});



// ----- Login to Discord with your client's token -----
client.login(token);
