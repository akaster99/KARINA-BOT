const fs = require('fs');
const Discord = require('discord.js');
const Client = require('./client/Client');
const {token} = require('./config.json');
const {Player} = require('discord-player');

const client = new Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

console.log(client.commands);

const player = new Player(client);

player.on('error', (queue, error) => {
  console.log(`[${queue.guild.name}] NAVIS가 문제가 생겼습니다.: ${error.message}`);
});

player.on('connectionError', (queue, error) => {
  console.log(`[${queue.guild.name}] 연결에 문제가 생겼습니다.: ${error.message}`);
});

player.on('trackStart', (queue, track) => {
  queue.metadata.send(`🎶 | 노래 재생: **${queue.connection.channel.name}**에서 **${track.title}**재생`);
});

player.on('trackAdd', (queue, track) => {
  queue.metadata.send(`🎶 | 플레이리스트에 **${track.title}**추가`);
});

player.on('botDisconnect', queue => {
  queue.metadata.send('❌ | 다음에 또봐요!');
});

player.on('channelEmpty', queue => {
  queue.metadata.send('❌ | 아무도 없네..');
});

player.on('queueEnd', queue => {
  queue.metadata.send('✅ | 플레이리스트 끝!');
});

client.once('ready', async () => {
  console.log('Ready!');
  client.user.setActivity('!navis로 나비스 부르기', { type: 'PLAYING' })

});

client.once('reconnecting', () => {
  console.log('Reconnecting!');
});

client.once('disconnect', () => {
  console.log('Disconnect!');
});

//message 방식에서 interaction방식으로 바꾸는 코드
client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;
  if (!client.application?.owner) await client.application?.fetch();

  if (message.content === "!navis" && message.author.id === client.application?.owner?.id) {
      await message.guild.commands.set(client.commands).then(() => {
        message.reply("NAVIS CALLING 이제 /로 명령어 사용 가능!");
      })
      .catch((err) => {
        message.reply("NAVIS CALLING 실패 application.commands권한을 OAUTH2에서 주세요!");
        console.error(err)
      });
  }
});

//Interaction 방식의 명령어
client.on('interactionCreate', async interaction => {
  const command = client.commands.get(interaction.commandName.toLowerCase());

  try {
    //user 관련 명령어를 내릴 경우 client를 넘겨줘야 함.
    if (interaction.commandName == 'userinfo') {
      command.execute(interaction, client);
    } else {
      command.execute(interaction, player);
    }
  } catch (error) {
    console.error(error);
    interaction.followUp({
      content: '이명령어를 사용할 때 문제가 생겼습니다.',
    });
  }
});

client.login(token);
