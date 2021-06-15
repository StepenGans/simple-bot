const help = (prefix) => {
	return `❖❮ WhatsApp Bot ❯❖

◉ Prefix: *${prefix}*
◉ Author: *Breaad (Arya)*
◉ Status: *${statz}* 
◉ No API: *True*

❍❲ *Owner Menu* ❳❍
▣➵ ${prefix}setprefix
▣➵ ${prefix}> [eval]
▣➵ $ [stdout]
▣➵ ${prefix}ht [text]
▣➵ ${prefix}hts [tag sticker]
▣➵ ${prefix}shutdown

❍❲ *Downloader Menu* ❳❍
▣➵ ${prefix}mediafire [link]
▣➵ ${prefix}facebook [link]
▣➵ ${prefix}instagram [link] (-foto/-video)
▣➵ ${prefix}ytmp3 [link]
▣➵ ${prefix}ytmp4 [link]

❍❲ *Search Menu* ❳❍
▣➵ ${prefix}play [query]
▣➵ ${prefix}ytvideo [query]
▣➵ ${prefix}ytsearch [query]
▣➵ ${prefix}lirik [query]
▣➵ ${prefix}igstalk [username]

❍❲ *Bot Status* ❳❍
▣➵ ${prefix}speed

❍❲ *Sticker Menu* ❳❍
▣➵ ${prefix}sticker (foto/video/gif)
▣➵ ${prefix}swm (Name|Author)
▣➵ ${prefix}toimg


This bot uses javascript programming and node js.*

`
}

exports.help = help
