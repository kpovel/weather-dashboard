<script>
  import { page } from '$app/stores';

  const paths = [
    { name: 'Current weather', href: '/' },
    { name: 'Next week', href: '/next-week' }
  ];
  $: pageRoute = $page.route.id;
</script>

<header>
  <nav class="m-auto h-[8vh] bg-gradient-to-br from-sky-200 to-blue-300">
    <div class="flex h-full items-center justify-center">
      {#each paths as path}
        <a
          class={`mx-2 rounded-lg border border-slate-200 p-2 text-center ${
            pageRoute === path.href && 'bg-blue-400'
          }`}
          href={path.href}>{path.name}</a
        >
      {/each}
    </div>
  </nav>
</header>
