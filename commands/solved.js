module.exports = {
  name: 'solved',
  description: '백준 푼 문제 리스트 ',
  options: [
    {
      name: 'user',
      type: 6, //USER TYPE
      description: '정보를 얻고 싶은 회원 이름',
      required: true,
    },
  ],
  execute(interaction, client) {
    const member = interaction.options.get('user').value;
    const user = client.users.cache.get(member);

    interaction.reply({
      content: `이름: ${user.username}, ID: ${user.id}, 프로필: ${user.displayAvatarURL({dynamic: true})}`,
      ephemeral: true,
    });
  },
};
