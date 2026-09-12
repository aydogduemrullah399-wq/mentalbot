module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ Bot giriş yaptı: ${client.user.tag}`);
    client.user.setActivity('/ticket-panel | Destek', { type: 3 }); // type 3 = Watching
  },
};
