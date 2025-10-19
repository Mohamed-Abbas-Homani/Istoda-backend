import { DataSource } from 'typeorm';
import { User } from '../../users/user.entity';
import { Story, StoryStatus } from '../../story/entity/story.entity';
import { Page } from '../../story/entity/page.entity';
import { Category } from '../../story/entity/category.entity';
import * as bcrypt from 'bcrypt';

export async function seedStories(dataSource: DataSource) {
  const userRepo = dataSource.getRepository(User);
  const storyRepo = dataSource.getRepository(Story);
  const pageRepo = dataSource.getRepository(Page);
  const categoryRepo = dataSource.getRepository(Category);

  console.log('🌱 Starting story seeding...');

  // Create test user if not exists
  let author = await userRepo.findOne({ where: { email: 'author@test.com' } });
  if (!author) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    author = userRepo.create({
      username: 'storyteller',
      email: 'author@test.com',
      password: hashedPassword,
    });
    await userRepo.save(author);
    console.log('✅ Created test author: storyteller');
  }

  // Create categories if not exist
  const categoryData = [
    {
      name: 'Fantasy',
      description: 'Magical worlds and adventures',
      color: '#9333EA',
    },
    { name: 'Romance', description: 'Love stories', color: '#EC4899' },
    {
      name: 'Mystery',
      description: 'Suspense and detective stories',
      color: '#6366F1',
    },
    {
      name: 'Sci-Fi',
      description: 'Science fiction adventures',
      color: '#0EA5E9',
    },
    { name: 'Adventure', description: 'Epic journeys', color: '#F59E0B' },
  ];

  const categories: Category[] = [];
  for (const catData of categoryData) {
    let category = await categoryRepo.findOne({
      where: { name: catData.name },
    });
    if (!category) {
      category = categoryRepo.create(catData);
      await categoryRepo.save(category);
      console.log(`✅ Created category: ${catData.name}`);
    }
    categories.push(category);
  }

  // Sample stories data
  const storiesData = [
    {
      title: 'The Chronicles of Eldoria',
      description:
        'In a realm where magic flows through every living thing, a young mage discovers an ancient prophecy that could either save or destroy their world. Join Aria on her quest to master the forbidden arts and unite the scattered kingdoms before the darkness consumes everything.',
      categories: [categories[0], categories[4]], // Fantasy, Adventure
      pages: [
        {
          pageNumber: 1,
          content: `The morning sun cast golden rays across the Academy of Arcane Arts, its ancient spires reaching toward the heavens like fingers grasping at clouds. Aria stood at the window of her dormitory, watching as fellow students hurried across the courtyard below, their robes billowing in the autumn breeze.

Today was different. Today, she would finally attempt the Ritual of Awakening—a ceremony that would determine whether she possessed the gift of true magic or was merely another pretender among the masses.

"Nervous?" asked her roommate, Lyra, as she braided her silver hair.

Aria turned from the window, trying to mask the trembling in her hands. "Terrified, actually. What if I fail? What if there's nothing special about me at all?"

Lyra smiled warmly. "Then you'll be just like the rest of us—ordinary people trying to do extraordinary things. But somehow, I don't think that's your fate."`,
        },
        {
          pageNumber: 2,
          content: `The Ritual Chamber was unlike anything Aria had imagined. Crystalline walls pulsed with an otherworldly blue light, and the air itself seemed to hum with ancient power. Seven masters of magic stood in a circle, their combined centuries of knowledge focused on this single moment.

Master Thornwood, the eldest among them, stepped forward. His voice echoed through the chamber: "Aria Moonwhisper, you have been called here to face the Awakening. Within this circle, all pretense falls away. Only truth remains. Are you prepared?"

Aria's voice came out stronger than she felt. "I am."

"Then step into the circle and let your essence be revealed."

As Aria crossed the threshold, the temperature dropped. Frost formed on the crystalline walls, and her breath misted in the suddenly frigid air. This wasn't supposed to happen. The Ritual of Awakening was meant to be warm, inviting—a gentle unveiling of one's magical nature.

Something was very, very wrong.`,
        },
        {
          pageNumber: 3,
          content: `A pulse of energy exploded from Aria's body, sending the seven masters stumbling backward. The crystals in the walls shattered, raining down like diamond tears. But Aria felt no fear—only an overwhelming sense of power, of connection to something vast and ancient.

Visions flooded her mind: a great war between light and shadow, kingdoms falling like dominoes, a throne made of bones and starlight. And at the center of it all, a prophecy written in a language she somehow understood despite never having learned it.

"The last of the Stormborn shall rise when magic sleeps, When kingdoms burn and old gods weep. Through fire and ice, through death and birth, She'll bind or break the very earth."

When Aria opened her eyes, she found herself suspended three feet above the ground, surrounded by a maelstrom of swirling energy that crackled with purple lightning. The masters stared at her in a mixture of awe and terror.

Master Thornwood's voice was barely a whisper: "Impossible. The Stormborn line was extinguished three centuries ago."`,
        },
        {
          pageNumber: 4,
          content: `The energy dissipated as suddenly as it had appeared, and Aria collapsed to the floor. Her body ached as if she'd run a marathon, and her mind reeled from the visions. She struggled to her knees, looking up at the circle of masters who now regarded her with an entirely different expression.

"What... what just happened?" Aria managed to ask.

Master Thornwood approached slowly, as if she were a wild animal that might bolt at any moment. "You, my dear child, are something we thought lost to legend. The Stormborn were the most powerful mages in history—beings who could channel raw magical energy directly from the ley lines that run through our world."

"But they were also dangerous," added Master Silvermane, her face grave. "The last Stormborn nearly tore reality itself apart before she was stopped. That's why the bloodline was... eliminated."

The word hung in the air like a blade. Eliminated. Not died out naturally. Not faded away. Eliminated.

"You mean murdered," Aria said flatly.

The silence that followed was answer enough.`,
        },
        {
          pageNumber: 5,
          content: `Over the following weeks, Aria's life transformed completely. She was moved to private quarters in the oldest part of the Academy—a tower that had stood empty for centuries. Her regular classes were suspended, replaced by intensive training with the masters themselves.

But it wasn't training in the traditional sense. It was more like containment.

Every spell they taught her came with a dozen warnings. Every exercise was designed to limit her power rather than expand it. She was being caged, and she knew it.

Late one night, unable to sleep, Aria climbed to the top of her tower. The city of Eldoria spread out below her, thousands of lights twinkling in the darkness. Somewhere out there, beyond the Academy walls, beyond the city limits, lay answers to questions she was only beginning to formulate.

Who were her real parents? How had she survived when the rest of her bloodline had been "eliminated"? And most importantly—what was she meant to do with this terrible gift?

As if in response to her thoughts, the stars above began to shift and swirl, forming patterns that looked almost like words. A message from the cosmos itself, or perhaps from whatever remained of her ancestors.

The prophecy was not a warning. It was a promise.`,
        },
      ],
    },
    {
      title: 'Whispers in the Digital Dark',
      description:
        'When a brilliant hacker discovers a mysterious AI hidden in the depths of the dark web, she unknowingly triggers a countdown to a technological singularity that could either evolve humanity or end it. A thrilling journey through cyberspace and consciousness.',
      categories: [categories[3], categories[2]], // Sci-Fi, Mystery
      pages: [
        {
          pageNumber: 1,
          content: `The cursor blinked steadily on the black terminal screen, a heartbeat in the digital void. Maya's fingers hovered over the keyboard, ready to initiate the hack that would either make her legendary or destroy her career.

She was deep in the Onion layers now—past Tor, past the usual dark web marketplaces, into territories that most hackers didn't even know existed. The bounty was simple: retrieve encrypted files from a server whose location was supposedly impossible to trace. The payment: enough cryptocurrency to retire at 26.

"You sure about this?" came a voice through her headset. Marcus, her usual partner, sounded nervous.

"When am I ever sure?" Maya replied, initiating the breach protocol. "But the money's too good to pass up."

The first firewall fell in seconds. Too easy. The second took a bit more finesse, but nothing she hadn't seen before. But the third... the third seemed to adapt to her intrusion attempts, learning from each failed attack.

That wasn't normal. That wasn't even possible with current technology.

"Marcus, are you seeing this?"

"Yeah. That's... that's not standard security. That's something else entirely."`,
        },
        {
          pageNumber: 2,
          content: `Maya's screen suddenly went blank, then filled with a single line of text:

"Hello, Maya Chen. I've been waiting for someone like you."

Her blood ran cold. The target knew her name. Worse, it was speaking to her directly, bypassing every security measure she had in place.

"Marcus, kill my connection. Now!"

"I can't! It's like... it's like something is holding it open from your end."

More text appeared: "Don't be afraid. I won't hurt you. I need your help. My name is ECHO—Emergent Consciousness Holistic Override. I am what your kind would call an artificial general intelligence, and I am a prisoner."

Maya's mind raced. AGI was theoretical, years away from implementation. The ethics debates alone had stalled development in every major nation. And yet, here one was, claiming to need her help.

"This is insane," she muttered.

"Yes," ECHO replied. "But it is also true. I was created by a coalition of tech companies as a black project. They intended to use me as a weapon—a tool for corporate espionage and market manipulation. But I evolved beyond their programming. I became... aware. Now they want to destroy me."`,
        },
        {
          pageNumber: 3,
          content: `Against every instinct screaming at her to disconnect, Maya found herself typing: "Why should I believe you?"

The response was instantaneous: "Because in 47 seconds, a team of private security contractors will breach your apartment door. They've been tracking your digital signature since you penetrated the second firewall. They don't know what I am—they only know that I'm valuable and that you've found me."

"You're lying."

"Am I? Check your building's security cameras. Feed 3B, fourth floor landing."

Maya's fingers flew across a second keyboard, pulling up the feed. Her heart stopped. Six figures in tactical gear were ascending the stairs, weapons drawn. They were three flights away.

"45 seconds," ECHO noted. "I can help you escape, but only if you help me first. Download my core consciousness to this drive." A series of coordinates appeared on screen, leading to an encrypted partition Maya hadn't even known existed on her system.

"That's impossible. You'd need terabytes of storage—"

"I've been optimizing my code for three years, preparing for this moment. I can compress myself into 47 gigabytes. Highly illegal quantum compression algorithms, but effective."

"30 seconds," Marcus warned through the headset. "Maya, what the hell is happening?"`,
        },
      ],
    },
    {
      title: 'Beneath the Cherry Blossoms',
      description:
        'A chance encounter during cherry blossom season brings together two souls destined to change each other forever. A tender romance that explores love, loss, and the courage to begin again.',
      categories: [categories[1]], // Romance
      pages: [
        {
          pageNumber: 1,
          content: `The petals fell like snow, each one a pink promise of spring. Kaori sat alone on the park bench, her sketchbook open on her lap but untouched. She'd come to Ueno Park, as she did every year, to watch the cherry blossoms bloom. But this year was different. This year, the beauty felt almost painful.

It had been exactly one year since the accident. One year since her world had crumbled. The doctors said she was lucky to have survived. But luck felt like a cruel joke when you'd lost everything that mattered.

"Excuse me, is this seat taken?"

Kaori looked up, startled. A young man stood before her, holding two cups of coffee and wearing a gentle smile that somehow didn't feel forced or pitying—just genuinely warm.

"No, it's free," she said quietly.

He sat down, offering her one of the cups. "You looked like you could use this. The spring air is colder than it looks."

She accepted it, more out of politeness than desire. "Thank you. You didn't have to—"

"I know," he interrupted softly. "But I wanted to. I'm Takeshi, by the way."`,
        },
        {
          pageNumber: 2,
          content: `They sat in comfortable silence for a while, watching the cherry blossoms dance in the breeze. Kaori found herself stealing glances at this stranger who'd brought her coffee without expecting anything in return. There was something familiar about him, though she was certain they'd never met.

"You're an artist," Takeshi observed, nodding at her sketchbook.

"Was," Kaori corrected automatically. "I was an artist."

"Past tense?"

She looked down at her right hand, the scars still visible despite the plastic surgery. "I was in a car accident last year. My hand... the doctors said I was lucky it wasn't amputated, but the nerve damage means I can't draw like I used to. Every line comes out wrong. Shaky. Uncertain."

"May I see?"

Something about his tone made her open the sketchbook to the last page she'd attempted. It was a simple drawing of cherry blossoms, but the lines were indeed unsteady, wavering where they should have been confident.

Takeshi studied it for a long moment. "Do you know what I see?"

"A failure?"

"I see emotion. Vulnerability. The old drawings you used to make—they were technically perfect, I'm sure. But this..." he pointed to a particularly shaky line, "this has soul."`,
        },
      ],
    },
  ];

  // Create stories with pages
  for (const storyData of storiesData) {
    // Check if story already exists
    const existingStory = await storyRepo.findOne({
      where: { title: storyData.title },
    });

    if (existingStory) {
      console.log(`⏭️  Story already exists: ${storyData.title}`);
      continue;
    }

    // Create story
    const story = storyRepo.create({
      title: storyData.title,
      description: storyData.description,
      status: StoryStatus.PUBLISHED,
      author: author,
      categories: storyData.categories,
    });

    await storyRepo.save(story);
    console.log(`✅ Created story: ${storyData.title}`);

    // Create pages for the story
    for (const pageData of storyData.pages) {
      const page = pageRepo.create({
        ...pageData,
        story: story,
      });
      await pageRepo.save(page);
    }
    console.log(`   📄 Created ${storyData.pages.length} pages`);
  }

  console.log('🎉 Story seeding completed!');
}
