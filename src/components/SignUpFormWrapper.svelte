<script>
  import SignUpFormIndiv from './SignUpFormIndiv.svelte';
  import SignUpFormCorp from './SignUpFormCorp.svelte';
  import { WrenchSolid, BriefcaseSolid, PersonSolid } from 'svelte-awesome-icons';

  let formType = ''; // default form type
</script>

<style>
  .card {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 0.75rem;
    margin: 0.5rem;
    cursor: pointer;
    transition: all 0.3s;
    background-color: white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .card:hover,
  .card.active {
    border-color: #FF9950;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), inset 0 0 10px 2px rgba(255, 153, 80, 1);
  }

  .card-title {
    font-size: 1.25rem;
    font-weight: 500;
    margin-bottom: 0.75rem;
    color: #10182B;
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    color: #FF9950;
  }

  span {
    margin-left: 1rem;
    margin-top: 0;
  }

  /* Media queries for mobile devices */
  @media (max-width: 768px) {
    .card {
      width: 100%;
    }
  }
</style>

<div class="flex flex-wrap justify-center">
  <div
    class="card {formType === 'individual' ? 'active' : ''}"
    on:click={() => (formType = 'individual')}
    on:keydown={(e) => {
      if (e.key === 'Enter') {
        formType = 'individual';
      }
    }}
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
          <WrenchSolid size="32"/><span>Join events with Plebnet.Dev</span>
        </li>
        <li>
          <WrenchSolid size="32"/><span>Access to Mentoring - all skill levels welcome.</span>
        </li>
        <li>
          <WrenchSolid size="32"/><span>Access to Member only services.</span>
        </li>
      </ul>
    </div>
  </div>
  <div
    class="card {formType === 'corporate' ? 'active' : ''}"
    on:click={() => (formType = 'corporate')}
    on:keydown={(e) => {
      if (e.key === 'Enter') {
        formType = 'corporate';
      }
    }}
  >
    <div class="card-title">
      <span>Corporate Membership</span>
      <BriefcaseSolid size="24" class="mr-2" />
    </div>
    <div class="card-content">
      <ul>
        <li>
          <WrenchSolid size="32"/><span>Network with other active Engineers.</span>
        </li>
        <li>
          <WrenchSolid size="32"/><span>Access to member-only events</span>
        </li>
        <li>
          <WrenchSolid size="32"/><span>Up to 5 individual members</span>
        </li>
        <li>
          <WrenchSolid size="32"/><span>
Corporate Partner Logo on website</span>
        </li>
      </ul>
    </div>
  </div>
</div>

{#if formType === 'individual'}
  <SignUpFormIndiv />
{:else if formType === 'corporate'}
  <SignUpFormCorp />
{/if}