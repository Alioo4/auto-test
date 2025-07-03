import axios from 'axios';

const token = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;

export const sendMessage = async (payload: unknown, text?: string) => {
    const TEXT = JSON.stringify(payload, null, 2);

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    try {
        await axios.post(url, {
            chat_id: chatId,
            text: `📦 Yangi JSON ma'lumot ${text}:\n\`\`\`json\n${TEXT}\n\`\`\``,
            parse_mode: 'MarkdownV2',
        });
    } catch (error) {
        console.error('Xatolik:', error.response?.data || error.message);
    }
};
