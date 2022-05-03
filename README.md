# Braille

## Topic
For this project, I visualized the Braille language. I was interested in learning how Braille works as a system like any other language. Understanding how people use everyday assistive technologies helps strengthen my practice as a designer. 

## Motivation

Accessibility is a vast but often neglected topic in design work. Due to the popularization of universal design, an easy trap that designers will often fall into is to believe they are designing for everyone. However, design will never afford users universally. For example, I created this visualization on the web in English. My design disaffords non-English speakers and users without internet access.
I chose this topic because accessibility in information visualization is an underdeveloped knowledge area. As a design student studying visualization for the web, color-blindness is the most addressed accessibility topic. Color-blindness affects 8.0% of men and 0.5% of women, approximately 300 million people [^1]. Beyond this, accessibility in visualization for the web goes most unaddressed. While it’s helpful to be aware of color-blindness, visual impairment affects 2.2 billion people more generally [^2]. A person who has a visual impairment may rely on assistive technology such as a screen reader to interact with the web. Although researchers initially designed screen readers to assist people with low vision, they have a diverse group of users, including older people with changing abilities and cognitive and learning disabilities. They can also help people whose ability has changed temporarily or situationally, such as someone with a broken arm or sitting in bright sunlight [^3].

## Data

For this project, all of my data were hand-collected. The most important part of the data collection process was an interview I conducted with my friend Megan who has blindness. Braille is a tactile language that is learned and used through embodied experience. Talking with Megan about their experience using Braille is central to this project because there is an inherent tension in the visual representation of a system that is experienced tactilely and fundamentally cannot be experienced visually, for whom this topic is most pertinent. Additionally, I collected matrix positioning and spacing information so that the visual cells can accurately represent physical Braille cells. 

![Braille cell spacing and positioning](/images/cell_spacing.gif)
[Image source](https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.mkdesign.uk%2Fbraille-specifications.html&psig=AOvVaw02UPCiaC8gpEuYXovWpJwt&ust=1651672533226000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCJj2pui9w_cCFQAAAAAdAAAAABAD)

## Research

I began by researching how the Braille system works by interviewing Megan, watching several Youtube videos, and reading literature on the development of the system. Additionally, I researched how other visual designers have shown language systems.

### Videos
* https://www.youtube.com/watch?v=fbUmaUV02gg
* https://www.youtube.com/watch?v=sqQ3gdE7ks0

### Language systems visualized

![Image showing connections between Phoencian, Etrusan, and Modern English in pastel colors. Dotted lines show connections between characters.](/images/alphabet.jpg)
[Image source](https://www.redbubble.com/i/art-board-print/Evolution-of-the-Alphabet-poster-by-iyaaad/70674745.ZL3U1)
![Image showing connectios between Phoencian, Archaic Greek, Archaic Latic, Roman, and Modern Latin in rainbow colors on a black background. Dotted lines show connections between characters.](/images/Visualizing-the-Evolution-of-the-Alphabet.png)
[Image source](https://www.visualcapitalist.com/from-greek-to-latin-visualizing-the-evolution-of-the-alphabet/)
![Diagram showing connections between Futhark, Arabic, Latin, Green, Phoencian, Aramaic, Syriac, Cyrillic, Hebrew, Latin, and Greek. Characters are black text on a rainbow background. Lines of different weights show connections between characters. The diagram resembles a transportation diagram.](/images/maxresdefault.jpg)
[Image source](https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dul8NVfWKXZg&psig=AOvVaw1Xu1J5ezd5W6AqoSh2pwGI&ust=1651673942286000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCPCfyIfDw_cCFQAAAAAdAAAAABAJ)

### Code accessibility

#### HTML

* HTML should include a language attribute so that a screen reader can correctly accent and pronounce the content on the screen.

```
<html lang="en">
```

#### SVG


## Sources

[^1]: https://www.clintoneye.com/color-blindness.html#:~:text=There%20are%20an%20estimated%20300,are%20color%20blind%20(0.5%25).
[^2]: https://www.who.int/news-room/fact-sheets/detail/blindness-and-visual-impairment#:~:text=Globally%2C%20at%20least%202.2%20billion,uncorrected%20refractive%20errors%20and%20cataracts. 
[^3]: https://www.w3.org/WAI/fundamentals/accessibility-intro/ 



