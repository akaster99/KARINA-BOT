const {GuildMember} = require('discord.js');

module.exports = {
  name: 'skip',
  description: '음악 스킵',
  async execute(interaction, player) {
    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
      return void interaction.reply({
        content: '음성 채널에 들어가 주세요!',
        ephemeral: true,
      });
    }

    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !== interaction.guild.me.voice.channelId
    ) {
      return void interaction.reply({
        content: '카리나와 같은 음성채널에 들어가 주세요',
        ephemeral: true,
      });
    }

    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) return void interaction.followUp({content: '❌ | 재생되고 있는 음악이 없습니다!'});
    const currentTrack = queue.current;
    const success = queue.skip();
    return void interaction.followUp({
      content: success ? `✅ |  **${currentTrack}**!를 스킵했습니다.` : '❌ | 에러 발생!',
    });
  },
};
