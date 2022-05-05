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

I began by researching how the Braille system works by interviewing Megan, watching several Youtube videos on Braille and web accessibility more generally. Additionally, I read literature on the development of the system and researched how other visual designers have shown language systems.

### Videos

* https://www.youtube.com/watch?v=fbUmaUV02gg
* https://www.youtube.com/watch?v=sqQ3gdE7ks0
* https://www.youtube.com/watch?v=3f31oufqFSM

### Language systems visualized

![Image showing connections between Phoencian, Etrusan, and Modern English in pastel colors. Dotted lines show connections between characters.](/images/alphabet.jpg)

[Image source](https://www.redbubble.com/i/art-board-print/Evolution-of-the-Alphabet-poster-by-iyaaad/70674745.ZL3U1)

![Image showing connectios between Phoencian, Archaic Greek, Archaic Latic, Roman, and Modern Latin in rainbow colors on a black background. Dotted lines show connections between characters.](/images/Visualizing-the-Evolution-of-the-Alphabet.png)

[Image source](https://www.visualcapitalist.com/from-greek-to-latin-visualizing-the-evolution-of-the-alphabet/)

![Diagram showing connections between Futhark, Arabic, Latin, Green, Phoencian, Aramaic, Syriac, Cyrillic, Hebrew, Latin, and Greek. Characters are black text on a rainbow background. Lines of different weights show connections between characters. The diagram resembles a transportation diagram.](/images/maxresdefault.jpg)

[Image source](https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dul8NVfWKXZg&psig=AOvVaw1Xu1J5ezd5W6AqoSh2pwGI&ust=1651673942286000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCPCfyIfDw_cCFQAAAAAdAAAAABAJ)


### Code accessibility

#### HTML

* HTML should include a language attribute so that a screen reader can correctly accent and pronounce the content on the screen [^4].

```
<html lang="en">
```

* HTML should include a descriptive title tag to assist people moving between open tabs[^5]

```
<title>A descriptive page title</title>
```

* HTML images should always include alt tags that describe an image that is useful for interacting and understanding page content[^6]

```
<img alt="Image of ..." src="">
```

#### SVG

One of the nice things about using D3 from an accessibility perspective is its reliance on SVG. SVG is more accessible than alternative image formats such as PNG or JPG because it contains structured content accessible to a screen reader. With a PNG or JPG, the screen reader can only access content that is available in the `<alt>` tag. While SVG is more accessible than PNG or JPG, a designer can aid navigation by grouping content and adding additional labels to the SVG. 

Several elements can make an SVG more accessible to screen readers [^7]

* Add a `<title>` tag inside the SVG as the first child of its parent element
* Add an `aria-labelledby` attribute to the `<svg>` tag that links to the title
* Add a `<role>` tag

In SVG, this looks like this:

```
<svg aria-labelledby="titleID" role="img">
    <title id="titleID">A short title</title>
</svg>
```

In D3, this looks like this:

```
let svg = d3.select("#chart")
        .append('svg')
            .attr("role", "image")
            .attr("aria-labelledby","titleID")
            .append("title")
                .attr("id", "titleID")
                .text("SVG title");
```

An additional steps a designer can take are to add aria labels to group elements

* Adding grouping elements to the SVG
* Append `<aria-label>` tag and `<role>` tag [^8]


In D3, this looks like this:

```
let svg = svg
    .append("g")
        .attr('role', 'list')
        .attr('aria-label', 'chart type');
```

I've also added alt tags to each image in this markdown file for added accessiblity to the documentation of this process.

### Mobile adaptivity

To make the visualization somewhat mobile adaptive, I added a breakpoint of 800 pixels in the javascript code. The javascript code resizes the SVG, and the CSS code pivots the layout to be a column-based layout instead of a row-based layout. In the first step, the cell is magnified to show the matrix, which gets resized with a breakpoint. Additionally, I modified CSS properties, e.g. font-size, to adapt the overall fit of the content to a smaller screen.

### Design process

### Sketches

I started with sketching out how I thought I could potentially show connections in the system. Overall, I wanted to keep the design of the page simple. The hope for the visualization is that it is a more accessible design. Complicating the design could reduce the general accessibility.

![Initial sketch of scrollytelling flow](/images/sketch1.png)

![Sketch showing connections between dots with color.](/images/sketch2.jpg)

![Sketch showing connections in the system with lines.](/images/sketch4.png)


### Color

I added color to show connections between groups. I started with the pastel color palette from one of the visualizations I drew inspiration from. However, that palette relies on the rainbow, which is not color-blind accessible.

![Image showing a non-color-blind friendly palette on the visualization](/images/design-process1.png)

I used coolors to develop a new palette which is color-blind accessible. Although it would be nice to have a ten-color palette because there are ten groups, it is challenging to construct palettes with 10 different colors that are color-blind accessible.
![Image showing coolors color-blind friendly checking tool](/images/checking-for-color-blindness.png)


## Sources

[^1]: https://www.clintoneye.com/color-blindness.html#:~:text=There%20are%20an%20estimated%20300,are%20color%20blind%20(0.5%25).
[^2]: https://www.who.int/news-room/fact-sheets/detail/blindness-and-visual-impairment#:~:text=Globally%2C%20at%20least%202.2%20billion,uncorrected%20refractive%20errors%20and%20cataracts. 
[^3]: https://www.w3.org/WAI/fundamentals/accessibility-intro/
[^4]: Ibid.
[^5]: https://www.w3.org/WAI/test-evaluate/preliminary/
[^6]: Ibid.
[^7]: https://css-tricks.com/accessible-svgs/
[^8]: https://www.a11ywithlindsey.com/blog/accessibility-d3-bar-charts


