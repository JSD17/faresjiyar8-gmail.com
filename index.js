const Discord = require('discord.js');
const client = new Discord.Client();
const ms = require('ms')
const fs = require('fs')



var token = "NjY1NjY0NjQ4OTUxMTAzNTU5.XkP3UA.UQGkQ0YRIIXcXxoi3jPxXUZ9WG4"
var prefix = "!"


client.on('ready', () => {

    console.log("salut je suis co");
    });


    // message arriver
    client.on('guildMemberAdd', member =>{
    let embed = new Discord.RichEmbed()
        .setColor('GREEN')
        .setDescription('🎉 **' + member.user.username + '** **à rejoint !** ' + member.guild.name )
        .setFooter('Nous sommes désormais' +   member.guild.memberCount)
        .setTimestamp()
        member.addRole('671457410610626592')
        member.send("salut toi, bienvenue sur le serveur **League of Legends** \n Toute l'équipe de modération te souhaite la bienvenue\n n'oublie pas d'aller voir les règle pour ne pas te faire ban pour rien; \n tien le lien du serveur pour inviter tes amis https://discord.gg/ADpGq83 \n et sur ce amuse toi bien et bonne journée.")
    member.guild.channels.get('670696249690947604').sendMessage(embed)
    });

    //message de depart
    client.on('guildMemberRemove', member =>{
    let embed = new Discord.RichEmbed()    
        .setColor('GREEN')        
        .setDescription('**' + member.user.username + '** **a quitté** ' + member.guild.name)
        .setFooter('**Nous sommes désormais**' +   member.guild.memberCount)
        .setTimestamp();
    member.guild.channels.get('670696435850936354').sendMessage(embed)
 
    });

    // bot ms
    client.on("message", async message => {
     if(message.content.startsWith(prefix + "botms")) {
        if(message.channel.type === "dm") return ("impossible")
        let botmsembed = new Discord.RichEmbed()
            .setThumbnail(message.author.displayAvatarUrl)
            .setColor('RANDOM')
            .setDescription(`__**j'ai ${client.ping} ms**__`)
        message.channel.send(botmsembed)
    }
              
    //help
    if (message.content === prefix + "help"){
        if(message.channel.type === "dm") return ("impossible")
        message.delete()

        let embed = new Discord.RichEmbed()

        .setColor("RANDOM")
        .setAuthor(message.author.username, message.author.displayAvatarURL)
        .setTitle("__VOICI LA LISTE DES COMMANDES__")
        .setDescription("__MODERATEUR __```kick;ban;tempban(auto 7 jour);clear;warn;unwarn;vwarn``` \n\n __VIP__(et tout les grade au dessu)```report``` \n\n  FUN```botms;serveurinfo;youtube;twitter;avatar``` ")
        .setFooter(`__commande exécutée par__ ${message.author.username}`)
        .setTimestamp()

        message.channel.send(embed)
    
    
    }
  
    // warn
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
     if (args[0].toLowerCase() === prefix + "warn") {
        if(message.channel.type === "dm") return ("impossible")
            const warns = JSON.parse(fs.readFileSync('./warns.json'))
            
           
            if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("**__Vous n'avez pas la permission d'utiliser cette commande__**")
            let member = message.mentions.members.first()
            if (!member) return message.channel.send("**__Veuillez mentionner un membre__**")
            if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas warn ce membre")
            let reason = args.slice(2).join(' ')
            if (!reason) return message.channel.send("**__Veuillez indiquer une raison__**")
            if (!warns[member.id]) {
                warns[member.id] = []
            }
            warns[member.id].unshift({
                reason: reason,
                date: Date.now(),
                mod: message.author.id
            })
            if(warns[member.id].length == 3) {
                member.send('**__tu a été kick de League of Legends /FR/ car tu a accumuler 3 warn__**')
                message.channel.send(member + "**__a été kick car 3 warn__**").then(m => m.delete(5000));
                message.guild.member(member).kick()
                }
           if(warns[member.id].length == 5) {
            member.send('**__tu a été ban 10 jours de League of Legends /FR/ car tu a accumuler 5 warn__**')
            message.channel.send(member + "**__a été ban 10 jour car 5 warn__**").then(m => m.delete(5000));
                    message.guild.member(member).ban() ({days: 10})

                  }
             if(warns[member.id].length == 7) {
             member.send('**__tu a été ban de League of Legends /FR/ car tu a accumuler 7 warn__**')
             message.channel.send(member + "**__a été ban définitivement car il a accumulé 7 warn__**").then(m => m.delete(5000));
             message.guild.member(member).ban()
        
                          }
            fs.writeFileSync('./warns.json', JSON.stringify(warns))
            message.channel.send(member + "**__a été warn pour__ **" + reason + " :white_check_mark:")
    }
    
    //unwarn
    if (args[0].toLowerCase() === prefix + "unwarn") {
        if(message.channel.type === "dm") return ("impossible")
        let warns = JSON.parse(fs.readFileSync("./warns.json", "utf8"));
        let member = message.mentions.members.first()
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("**__Vous n'avez pas la permission d'utiliser cette commande.__**").then(m => m.delete(5000));
        if(!member) return message.channel.send("**__Membre introuvable__**")
        if(member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("**__Vous ne pouvez pas unwarn ce membre.__**").then(m => m.delete(5000));
        if(!member.manageable) return message.channel.send("**__Je ne pas unwarn ce membre.__**")
        if(!warns[member.id] || !warns[member.id].length) return message.channel.send("**__Ce membre n'a actuellement aucun warns.__**").then(m => m.delete(5000));
        warns[member.id].shift()
        fs.writeFileSync('./warns.json', JSON.stringify(warns))
        message.channel.send("**__Le dernier warn de__** " + member + "** __a été retiré :white_check_mark:__**")
    }

    //viewwarn
    if (args[0].toLowerCase() === prefix + "vwarn") {
        if(message.channel.type === "dm") return ("impossible")
        let warns = JSON.parse(fs.readFileSync("./warns.json", "utf8"));
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("**__Vous n'avez pas la permission d'utiliser cette commande__**").then(m => m.delete(5000))
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("**__Veuillez mentionner un membre__**").then(m => m.delete(5000))
        let embed = new Discord.RichEmbed()
            .setAuthor(member.user.username, member.user.displayAvatarURL)
            .addField('**WARN**', ((warns[member.id] && warns[member.id].length) ? warns[member.id].slice(0, 10).map(e => e.reason) : "**__Ce membre n'a aucun warns__**"))
            .setTimestamp()
        message.channel.send(embed)
    }


     //youtube
    if (message.content.startsWith(prefix + 'youtube')) {
        if(message.channel.type === "dm") return ("impossible")
    let embed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setTitle("VOILA LA CHAINE YOUTUBE DE JSD")
    .setDescription("__**pour avoir acces a la chaine youtube de JSD [clique ici](https://www.youtube.com/channel/UCifHh1XVzQVn_dClSidynEw?view_as=subscriber) noublie surtouts pas de t'abonner__**")
    .setTimestamp()
    message.channel.send(embed)
    }

    //twitter
    if (message.content.startsWith(prefix + 'twitter')) {
        if(message.channel.type === "dm") return ("impossible")
        let embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle("VOILA LE TWITTER DE JSD")
        .setDescription("pour avoir acces aux twitter de JSD [clique ici](https://twitter.com/EliteJsd) noublie pas de me suivre")
        .setTimestamp()
        message.channel.send(embed)
    }
     
      
    //report
    if(message.content.startsWith(prefix + "report")) {
        if(message.channel.type === "dm") return ("impossible")
        if (message.deletable) message.delete();
    
        let rMember = message.mentions.members.first() || message.guild.members.get(args[1]);

        let args = message.content.split(" ").slice(1);

        if (!rMember)
            return message.reply("**veillez mentionner une personne**").then(m => m.delete(5000));
    
        if (rMember.hasPermission("BAN_MEMBERS") || rMember.user.bot)
            return message.channel.send("**je ne peut pas report cette utilisateur**").then(m => m.delete(5000));
     
        if (!args[0])
            return message.channel.send("**veillez selectionner une raison**").then(m => m.delete(5000));
        
        const channel = message.guild.channels.find(c => c.name === "reports")
            
        if (!channel)
            return message.channel.send("**veuillez executer cette commande dans le salon #reports**").then(m => m.delete(5000));
    
    let embed = new Discord.RichEmbed()
            .setColor("#ff0000")
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL)
            .setAuthor("Reported member", rMember.user.displayAvatarURL)
            .setDescription(`**- Member:** ${rMember} (${rMember.user.id})
            **- Reported by:** ${message.member}
            **- Reported in:** ${message.channel}
            **- Reason:** ${args.slice(1).join(" ")}`);
    
        return channel.send(embed);
       }

    //clear
    if (message.content.startsWith(prefix + "clear")) {
        if(message.channel.type === "dm") return ("impossible")
         if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("**Vous n'avez pas les permissions**").then(m => m.delete(5000));
        let args = message.content.split(" ").slice(1);
        if(!args[0]) return message.channel.send("**Vous n'avez pas définie le nombre de message a supprimer**").then(m => m.delete(5000));
        message.delete()
        message.channel.bulkDelete(args[0]).then(() => {
            message.channel.send(`**${args[0]} messages ont été supprimés.**`).then(m => m.delete(5000));
        })
    }

    //avatar
    if (message.content.startsWith(prefix + 'avatar')) {
        if(message.channel.type === "dm") return ("impossible")
     let member = message.mentions.users.first()
     var embedAuthor = new Discord.RichEmbed()
         .setTitle("Voici ton avatar " + message.author.username + " :")
         .setImage(message.author.avatarURL)
           if (!member) return message.channel.send(embedAuthor)
            var embed = new Discord.RichEmbed()
         .setTitle("Voici l'avatar de " + member.username + " :")
         .setImage(member.displayAvatarURL)
     message.channel.send(embed)
    }

    //tempban 
    if (message.content.startsWith(prefix + 'tempban')) {
        if(message.channel.type === "dm") return ("impossible")
        if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send("**Vous n'avez pas la permission d'utiliser cette commande**").then(m => m.delete(5000));
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("**Veuillez mentionner un utilisateur**").then(m => m.delete(5000));
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send("Vous ne pouvez pas bannir cet utilisateur :x:")
        if (!member.bannable) return message.channel.send("**Je ne peux pas bannir cet utilisateur**").then(m => m.delete(5000));
        member.send('**tu a été banni 7 jour de**' + member.guild.name)
        message.guild.ban(member, {days: 7})
        message.channel.send('**' + member.user.username + '** **a été banni :white_check_mark:**')
    }

    //ban
    if (message.content.startsWith(prefix + 'ban')) {
        if(message.channel.type === "dm") return ("impossible")
        if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send("**Vous n'avez pas la permission d'utiliser cette commande**").then(m => m.delete(5000));
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("**Veuillez mentionner un utilisateur**").then(m => m.delete(5000));
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send("Vous ne pouvez pas bannir cet utilisateur :x:")
        if (!member.bannable) return message.channel.send("**Je ne peux pas bannir cet utilisateur**").then(m => m.delete(5000));
        member.send('**tu a été ban definitivement de **' + member.guild.name)
        message.guild.ban(member)
        message.channel.send('**' + member.user.username + '** **a été banni :white_check_mark:**')
  
    }

    //anti lien
    if (message.content ==('https://' || 'http://' || 'discord.gg')){
     message.delete()
     let member = message.author
     message.author.send("**interdiction de poster des lien**");
     message.channel.send(`!warn ${member} poste un lien`).then(m => m.delete(1000));
    }

   
    //serveurinfo
    if (message.content.startsWith(prefix +"serveurinfo")){
        if(message.channel.type === "dm") return ("impossible")
        message.delete();
        let url = message.guild.iconURL;
        let owner = message.guild.owner.displayName
        let serverembed = new Discord.RichEmbed()
            .setDescription("Information du serveur")
            .setColor("RANDOM").setThumbnail(url)
            .addField("Nom:", message.guild.name)
            .addField("ID:", message.guild.id)
            .addField("Propriétère:",owner)
            .addField("Region:", message.guild.region)
            .addField("Créé le:", message.guild.createdAt)
            .addField("Tu as rejoins:", message.member.joinedAt)
            .addField("Membres totales:", message.guild.memberCount)
            .addField("Bot totales:", message.guild.botCount)
        return message.channel.send(serverembed)
    }

    //kick
    if (message.content.startsWith(prefix + "kick")) {
        if(message.channel.type === "dm") return ("impossible")
        if(!message.member.hasPermission("KICK_MEMBERS")){
            return message.channel.send(" ** Vous n'avez pas la permission d'utiliser cette commande ** ").then(m => m.delete(5000));
        }
        var member = message.mentions.members.first()
        try{
            member.kick().then((member) => {
                message.channel.send(member.displayName + "** a été kick  ** ");
            }).catch(() => {
                message.channel.send("**Vous n'avez pas la permission d'utiliser cette commande **").then(m => m.delete(5000));
    
            });
        }catch(error){
            message.channel.send("**Une erreur s'est produite desolé**").then(m => m.delete(5000));
        }
    }
})

client.login(token);
