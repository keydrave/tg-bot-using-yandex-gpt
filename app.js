const { Telegraf, Scenes} = require('telegraf');
const { session } = require('telegraf/session');
const config = require('./config');
const { savenewUser, chekAdmins } = require('./tools/cmnd');
const { mainScene, adminScene, tgNews } = require('./tools/session');

const gpt = new Telegraf(config.token);

let stage = new Scenes.Stage([mainScene, adminScene, tgNews]);

gpt.use(session());

gpt.use(stage.middleware());

gpt.use((ctx, next) => {

    if (!ctx.session) ctx.session = {};
    
    return next();
  });


  gpt.command('admin', async (ctx) => {
    let id = ctx.from.id;
    let admins = config.admins;

    

    const checkedAdmins = await chekAdmins(id, admins);

    if (checkedAdmins === true) {

        ctx.scene.enter('adminScene');

    } else {

        ctx.reply('У тебя нет доступа, малыш :D');
        
    };

});



gpt.start((ctx) => {

    let id = ctx.from.id;

    savenewUser(ctx, id);
    
    ctx.reply('Вы попали в чат гпт');

    ctx.scene.enter('mainScene');

})

gpt.launch();
