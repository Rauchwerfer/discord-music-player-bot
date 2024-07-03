if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const path = require('path');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const token = process.env.BOT_TOKEN;

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
    if (message.content === '!join') {

        message.delete()

        if (message.member.voice.channel) {
            const connection = joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });

            connection.on(VoiceConnectionStatus.Ready, () => {
                console.log('The bot has connected to the channel!');
            });

            connection.on(VoiceConnectionStatus.Disconnected, () => {
                console.log('The bot has disconnected from the channel.');
            });

            const player = createAudioPlayer();

            const audioFilePath = path.join(__dirname, 'YOUR_TRACK_NAME.mp3'); // Replace with the path to your audio file
            const resource = createAudioResource(audioFilePath);

            player.play(resource);
            

            player.on(AudioPlayerStatus.Playing, () => {
                console.log('The audio file is now playing!');
            });

            player.on(AudioPlayerStatus.Idle, () => {
                console.log('The audio file has finished playing.');
                connection.destroy();
            });

            connection.subscribe(player);
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }
});

client.login(token);