<script>
  import SignUpFormIndiv from './SignUpFormIndiv.svelte';
  import SignUpFormCorp from './SignUpFormCorp.svelte';
  import { WrenchSolid, BriefcaseSolid, PersonSolid } from 'svelte-awesome-icons';

  export let supabaseURLSecret;
  export let supabaseKeySecret;

  let formType = ''; // default form type
</script>

<style>
  .card {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 1rem;
    margin: 0.5rem;
    cursor: pointer;
    transition: all 0.3s;
    background-color: white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    min-width: 420px;
  }

  .card:hover,
  .card.active {
    border-color: #0077b6;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), inset 0 0 10px 2px rgba(255, 153, 80, 1);
  }

  .card-title {
    font-size: 1.25rem;
    font-weight: 500;
    margin-bottom: 1rem;
    color: #10182B;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .card-title span {
    margin-left: 0.5rem;
  }

  .card-content {
    font-size: 1rem;
    line-height: 1.5;
  }

  .card-content ul {
    list-style-type: none;
    padding: 0;
  }

  .card-content li {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    color: #FF9950
  }

  .card-content li .bullet-icon {
    color: #0077b6;
    margin-right: 0.5rem;
    font-size: 18px;
  }
  span {
    margin-left: 1rem;
    margin-top: 0;
  }
</style>

<div class="flex justify-center">
  <div
    class="card {formType === 'individual' ? 'active' : ''}"
    on:click={() => (formType = 'individual')}
  >
    <div class="card-title">
      <span>Individual Membership</span>
      <PersonSolid size="24" class="mr-2" />
</div>
    <div class="card-content">
      <ul>
 <li>
        <WrenchSolid size="32"/><span>Listing on the website</span>
      </li>
      <li>
        <WrenchSolid size="32"/><span>Join events with Pleb Devs</span>
      </li>
      <li>
        <WrenchSolid size="32"/><span>5 individual members - all skill levels welcome</span>
      </li>
      <li>
        <WrenchSolid size="32"/><span>Discounted prices to partner events</span>
      </li>
      </ul>
    </div>
  </div>
  <div
    class="card {formType === 'corporate' ? 'active' : ''}"
    on:click={() => (formType = 'corporate')}
  >
    <div class="card-title">
    <span>Corporate Membership</span>
      <BriefcaseSolid size="24" class="mr-2" />
    </div>
    <div class="card-content">
      <ul>
 <li>
        <WrenchSolid size="32"/><span>Listing on the website</span>
      </li>
      <li>
        <WrenchSolid size="32"/><span>Access to member-only events</span>
      </li>
      <li>
        <WrenchSolid size="32"/><span>Network with other active Engineers</span>
      </li>
      <li>
        <WrenchSolid size="32"/><span>All Developers welcome!</span>
      </li>
      </ul>
    </div>
  </div>
</div>

{#if formType === 'individual'}
  <SignUpFormIndiv {supabaseURLSecret} {supabaseKeySecret}/>
{:else if formType === 'corporate'}
  <SignUpFormCorp {supabaseURLSecret} {supabaseKeySecret}/>
{/if}