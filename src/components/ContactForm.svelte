<script lang="ts">
</script>

<div class="mx-auto max-w-xl">
	<h2 class="text-4xl font-bold tracking-tight sm:text-3xl mb-4">Contact Us</h2>

    <form method="POST" class="group relative">
			<label for="name" class="label float-left mt-8 mb-2">
				<span class="label-text">Name</span>
			</label>
			<input
				type="text"
				name="name"
				aria-label="name"
				placeholder="Enter your name"
				required
				autocomplete="off"
                class="input-bordered w-full text-black"

			/>
			<label for="name" class="label">
				<span class="label-text-alt">
				</span>
			</label>

			<label for="email" class="label float-left mt-8 mb-2">
				<span class="label-text">Email</span>
			</label>
			<input
				type="email"
				name="email"
				aria-label="email"
				placeholder="you@email.com"
				required
				autocomplete="off"
				class="input input-bordered w-full text-black"
			/>
			<label for="email" class="label">
				<span
					class="label-text-alt"
				>
				</span>
			</label>

			<label for="message" class="label float-left mt-8 mb-2">
				<span class="label-text">Message</span>
			</label>
			<textarea
				name="message"
				aria-label="message"
				placeholder="Write your message here..."
				required
				rows="10"
				autocomplete="off"
				class="textarea input-bordered w-full text-black"
			/>
			<label for="message" class="label">
				<span class="label-text-alt">
				</span>
			</label>

			<input
				type="submit"
				value="Submit"
				class="btn btn-primary mt-10"
			/>
		</form>


</div>
