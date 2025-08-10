import { AprilTagFamily } from 'apriltag'
import { createCanvas } from 'canvas';
import fs from 'node:fs';

// Choose from '16h5' '25h9' '36h9' '36h10' '36h11' 'circle21h7' 'circle49h12' 'custom48h12' 'standard41h12' or 'standard52h13'
const family_to_generate = "25h9";

import(`apriltag/families/${family_to_generate}.json`, { with: {type: "json"} })
.then(fam => fam["default"])
.then((family_config) => {
    console.log(`Attempting to generate ${family_config.codes.length} tags`)
    const family = new AprilTagFamily(family_config);
    const tags = [...Array(family_config.codes.length).keys()];

    tags.forEach(tag => {
        const tag_data = family.render(tag);
        const tag_width = tag_data[0].length;
        const tag_height = tag_data.length;

        const canvas = createCanvas(tag_width, tag_height);
        const ctx = canvas.getContext('2d')
        
        for (let y = 0; y < tag_height; y++) {
            for (let x = 0; x < tag_width; x++) {
                const color = tag_data[y][x] === 'b' ? 'black' : 'white';
                ctx.fillStyle = color;
                ctx.fillRect(x, y, 1, 1);
            }
        }

        const out = fs.createWriteStream(`./tags/${family_to_generate}-${tag}.png`);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on('finish', () => console.log(`Saved tag ${tag} to ./tags/${family_to_generate}-${tag}.png`));
    });
}).catch((e) => {
    console.log("Make sure the './tags' folder exists and the tag format you entered is valid!");
});
