<script>
  import SignUpFormIndiv from './SignUpFormIndiv.svelte';
  import SignUpFormCorp from './SignUpFormCorp.svelte';
  import { WrenchSolid, BriefcaseSolid, PersonSolid } from 'svelte-awesome-icons';

  let formType = ''; // default form type
  let showFormModal = false;

  function handleCardClick(type) {
    formType = type;
    showFormModal = true;
  }
</script>

<div class="flex flex-wrap justify-center">
  <div
    class="card {formType === 'individual' ? 'active' : ''}"
    on:click={() => handleCardClick('individual')}
    on:keydown={(e) => {
      if (e.key === 'Enter') {
        handleCardClick('individual');
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
          <div style="flex-shrink: 0;">
            <WrenchSolid size="32" />
          </div>
          <span>Listing on the website</span>
        </li>
        <li>
          <div style="flex-shrink: 0;">
            <WrenchSolid size="32" />
          </div>
          <span>Join events with Plebnet.Dev</span>
        </li>
        <li>
          <div style="flex-shrink: 0;">
            <WrenchSolid size="32" />
          </div>
          <span>Access to Mentoring - all skill levels welcome.</span>
        </li>
        <li>
          <div style="flex-shrink: 0;">
            <WrenchSolid size="32" />
          </div>
          <span>Access to Member only services.</span>
        </li>
      </ul>
    </div>
  </div>
  <div
    class="card {formType === 'corporate' ? 'active' : ''}"
    on:click={() => handleCardClick('corporate')}
    on:keydown={(e) => {
      if (e.key === 'Enter') {
        handleCardClick('corporate');
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
          <div style="flex-shrink: 0;">
            <WrenchSolid size="32" />
          </div>
          <span>Network with other active Engineers.</span>
        </li>
        <li>
          <div style="flex-shrink: 0;">
            <WrenchSolid size="32" />
          </div>
          <span>Access to member-only events</span>
        </li>
        <li>
          <div style="flex-shrink: 0;">
            <WrenchSolid size="32" />
          </div>
          <span>Up to 5 individual members</span>
        </li>
        <li>
          <div style="flex-shrink: 0;">
            <WrenchSolid size="32" />
          </div>
          <span> Corporate Partner Logo on website</span>
        </li>
      </ul>
    </div>
  </div>
</div>

{#if formType === 'individual'}
  <SignUpFormIndiv {showFormModal} on:modal={(e) => (showFormModal = e.detail)} />
{:else if formType === 'corporate'}
  <SignUpFormCorp {showFormModal} on:modal={(e) => (showFormModal = e.detail)} />
{/if}

<style>
  .flex {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: nowrap;
  }

  .card {
    width: 500px;
    max-width: 500px;
    flex: 0 0 auto;
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
    border-color: #ff9950;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), inset 0 0 10px 2px rgba(255, 153, 80, 1);
  }

  .card-title {
    font-size: 1.25rem;
    font-weight: 500;
    margin-bottom: 0.75rem;
    color: #10182b;
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
    color: #ff9950;
  }

  span {
    margin-left: 1rem;
    margin-top: 0;
  }

  /* Media queries for mobile devices */
  @media (max-width: 1040px) {
    .flex {
      flex-direction: column;
      align-items: center; /* Center the cards on smaller screens */
    }
    .card {
      flex: 1 0 80%; /* Increase the width to 80% on smaller screens */
      max-width: 80%;
    }
  }
</style>
