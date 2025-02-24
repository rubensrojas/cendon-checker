import fs from 'fs';
import path from 'path';

const DDRAGON_VERSION = '14.6.1'; // Update this to the latest version as needed
const ICONS_DIR = path.join(__dirname, '../../client/assets/champions-icons');

async function downloadChampionIcons() {
    try {
        // Create directory if it doesn't exist
        if (!fs.existsSync(ICONS_DIR)) {
            fs.mkdirSync(ICONS_DIR, { recursive: true });
        }

        // Get champion data from Data Dragon
        const response = await fetch(
            `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/data/en_US/champion.json`
        );
        const data = await response.json();
        const champions = data.data;

        // Download each champion's icon
        for (const championKey in champions) {
            const iconUrl = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${championKey}.png`;
            const filePath = path.join(ICONS_DIR, `${championKey}.png`);

            console.log(`Downloading ${championKey} icon...`);
            
            const imageResponse = await fetch(iconUrl);
            const arrayBuffer = await imageResponse.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            
            fs.writeFileSync(filePath, buffer);
        }

        console.log('All champion icons downloaded successfully!');
    } catch (error) {
        console.error('Error downloading champion icons:', error);
    }
}

// Execute the download
downloadChampionIcons();
