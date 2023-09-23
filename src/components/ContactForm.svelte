<script lang="ts">
</script>

<div>
	<h2 class="text-4xl font-bold tracking-tight sm:text-3xl mb-4">Contact Us</h2>
    <form method="POST" class="">
		<div class="mb-6">
			<label for="name" class="block text-sm font-medium">
				<span class="label-text">Name</span>
			</label>
			<input
				type="text"
				name="name"
				aria-label="name"
				placeholder="Enter your name"
				required
				autocomplete="off"
				class="py-3 px-4 block w-full text-md rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900"
			/>
			</div>
			<div class="mb-6">
			<label for="email" class="block text-sm font-medium">
				<span class="label-text">Email</span>
			</label>
			<input
				type="email"
				name="email"
				aria-label="email"
				placeholder="you@email.com"
				required
				autocomplete="off"
				class="py-3 px-4 block w-full text-md rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900"	    
			/>
			</div>
			<div class="mb-6">
			<label for="message" class="block text-sm font-medium">
				<span class="label-text">Message</span>
			</label>
			<textarea
				name="message"
				aria-label="message"
				placeholder="Write your message here..."
				required
				rows="10"
				autocomplete="off"
				class="py-3 px-4 block w-full text-md rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900"
			/>
			</div>
			<div class="mt-10 grid">
				<button type="submit" class="btn btn-primary cursor-pointer">
			<input
				type="submit"
				value="Submit"
			/>
			</button></div>
		</form>
</div>
