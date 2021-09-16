const fs = require('fs');

module.exports = {
  name: 'help',
  description: '사용 가능한 명령어 목록 보기.',
  execute(interaction) {
    let str = '';
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(`./${file}`);
      str += `명령어: ${command.name}, 설명: ${command.description} \n`;
    }

    return void interaction.reply({
      content: str,
      ephemeral: true,
    });
  },
};
