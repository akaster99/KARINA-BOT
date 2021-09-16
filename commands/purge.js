module.exports = {
  name: 'purge',
  description: '메세지 기록 지우기',
  options: [
    {
      name: 'num',
      type: 4, //'INTEGER' Type
      description: '지우고 싶은 메세지 갯수 (max 100)',
      required: true,
    },
  ],
  async execute(interaction) {
    const deleteCount = interaction.options.get('num').value;

    if (!deleteCount || deleteCount < 2 || deleteCount > 100) {
      return void interaction.reply({
        content: `2에서 100사이까지만 지울 수 있습니다.`,
        ephemeral: true,
      });
    }
      
    const fetched = await interaction.channel.messages.fetch({
      limit: deleteCount,
    });

    interaction.channel
      .bulkDelete(fetched)
      .then(() => {
        interaction.reply({
          content: `기록 삭제 성공!`,
          ephemeral: true,
        });
      })
      .catch(error => {
        interaction.reply({
          content: `이 이유 때문에 지울 수 없었어요: ${error}`,
          ephemeral: true,
        });
      });
  },
};
