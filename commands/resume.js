const {GuildMember} = require('discord.js');

module.exports = {
  name: 'resume',
  description: '노래 다시 재생',
  async execute(interaction, player) {
    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
      return void interaction.reply({
        content: '음성 채널에 들어가 주세요',
        ephemeral: true,
      });
    }

    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !== interaction.guild.me.voice.channelId
    ) {
      return void interaction.reply({
        content: '카리나와 다른 음성 채널에 있어요',
        ephemeral: true,
      });
    }

    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return void interaction.followUp({
        content: '❌ | 일시정지 된 음악이 없어요.',
      });
    const success = queue.setPaused(false);
    return void interaction.followUp({
      content: success ? '▶ | 다시 재생!' : '❌ | 에러 발생!',
    });
  },
};
