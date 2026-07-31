<template>
  <q-page class="n-page">
    <div class="text-h1 text-center">My Future, My Way</div>
    <q-card class="n-card q-ma-xl ">
      <div class="card-content q-pa-lg">
        <render-markdown :markdown="content" />

        <n-hobby-list />

        <render-markdown :markdown="content2" />

        <p class="text-center full-width q-my-md">Let's get sucked in...</p>
        <div class="row full-width justify-evenly">
          <q-icon class="n-random q-ma-none q-pa-none" ref="black_hole" color="black" name="circle" size="md">

            <q-tooltip :delay="1500">
              Random Post
            </q-tooltip>
          </q-icon>
        </div>
      </div>

    </q-card>
  </q-page>
</template>

<script setup lang="ts">
  import { NHobbyList } from 'src/components';
  // import { useLogger } from 'src/composables/useLogger';
  import { RenderMarkdown } from 'src/models/post';

  // const _logger = useLogger('About');

  // TODO: turn this into a post and allow admin to choose a post to be rendered here
  const content = `
  ## Magic is Real

  I see science as the closest thing to magic as we can get. Technology happens to be the implementation of scientific theory. A great example of this, and the most relevant to me, are computers. I hold a Bachelors Degree in Computer Science (math minor), and have so far lived my professional life as a developer, implementing and using a lot of the theory I learned (though I assure you, you can program and do a lot of things without knowing all of the theory). The longer I\'ve spent submersed in this field, the more it has started to feel almost magical.

  That being said, if we carry on with the analogy then programming is my incantation, memory and processing power my mana and intelligence. Resources that must be managed properly to make my spell a success. My scripts and various programs are my spellbook. Others publish droves of tomes for free use that I can easily tap into. Programming languages are different schools of magic, but more similar to how swordsmanship has many schools. Choosing the school that feels right to you, sometimes learning a school for a specific purpose if it seems well suited.

  The best part is- **everyone can do magic!**

  ## Who am I?

  Here I have chosen to go by Novabyte. As I mentioned, I'm a magician of sorts. I mostly do programming but I also dabble in math and physics. I don't claim to be an expert in either of these other fields, but thanks to awesome creators such as [3Blue1Brown](https://www.youtube.com/@3blue1brown), [Dr. Matt and the team at PBS Spacetime](https://www.youtube.com/@pbsspacetime) and many others (official list to come soon) I do feel like I have some solid knowledge in these areas. The fun thing, if you hadn't yet noticed, is that these two other fields can be "played with" (for lack of a better term) using programming. In fact, a lot of the creators I watch in these areas use programming to animate or assist their content in one way or another. On the other hand, I've definitely tapped into those fields for certain programming tasks, one example being game programming- specifically character movement or really most movement in general.

  I'm here to help shape the future- or at least push the present in the direction I believe it can go. This place is where I plan to share and chronicle the ideas and adventures I have while pursuing this. And ultimately, I want to help bring people into this magical world. I plan to try and teach as much as I make. To help people be as independent as they can be in this currently suffocating landscape of tech. Everything is more tinkerable than you think, or can be made to be so. It won't always be easy, but part of the fun is solving that puzzle. We've come an unbelievably long way already, but I believe if we pause, reflect on what we've learned, and rethink a few things, we're capable of a handful of immediate leaps- the kind of leaps that make technology feel magical again.

  ## What do I do?

  As mentioned I plan to have a lot of tech related content. I want to teach as well as share my projects and experiments. There's also a lot of other stuff I like to do that I would also like to cover here, however. Below is a list of the things I enjoy and plan to talk about or hopefully pursue at some point in time. As I write and tag articles this list will become clickable to find articles with the chosen tag.`;

  const content2 = 'If all of that sounds interesting to you and you\'re not sure where to jump in simply click on the block hole below and';

</script>

<style scoped lang="scss">
  .card-content {
    background-color: $primary;
  }


</style>
