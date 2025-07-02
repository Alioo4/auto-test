import axios from 'axios';

const BOT_TOKEN = '7027657121:AAGIwsGvG316xMZ3kmGrLRGmnrfylw8evtM';
const CHAT_ID = '-1001894592258';

export const sendMessage = async (payload: unknown, text?: string) => {
    const TEXT = JSON.stringify(payload, null, 2);

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    try {
        await axios.post(url, {
            chat_id: CHAT_ID,
            text: `📦 Yangi JSON ma'lumot ${text}:\n\`\`\`json\n${TEXT}\n\`\`\``,
            parse_mode: 'MarkdownV2',
        });
    } catch (error) {
        console.error('Xatolik:', error.response?.data || error.message);
    }
};
