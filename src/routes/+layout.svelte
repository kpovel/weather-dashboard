<script>
  import { onNavigate } from '$app/navigation';
  import '../app.css';
  import Nav from './Nav.svelte';

  onNavigate((navigation) => {
    if (!document.startViewTransition) return;

    return new Promise((res) => {
      document.startViewTransition(async () => {
        res();
        await navigation.complete;
      });
    });
  });
</script>

<Nav />
<slot />
