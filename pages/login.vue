<script setup lang="ts">
definePageMeta({
  layout: "preauth",
});

const email = ref("memoiz@example.com");
const password = ref("password");
const confirm = ref("password");

const salt = ref<string | undefined>("IQp40u7oLJN0/irJaoaFSQ==");

const error = ref("");

enum Mode {
  LOGIN,
  REGISTER,
}

const mode = ref(Mode.LOGIN);

const login = async () => {
  await alert("Login Placeholder");
};

const register = async () => {
  if (password.value !== confirm.value) {
    error.value = "Passwords do not match";
    return;
  }
  const { key, salt: generatedSalt } = await generateMasterKeyFromPassword(
    password.value,
    salt.value
  );
  if (!salt.value) salt.value = generatedSalt;
  alert(`key: ${key}, returned salt: ${generatedSalt}, salt: ${salt.value}`);
};
</script>

<template>
  <UContainer
    :class="
      cn([
        'rounded-md border p-8',
        'dark:border-gray-700 dark:bg-gray-900',
        'border-gray-300 bg-gray-100',
      ])
    "
  >
    <div class="flex h-full flex-col items-center justify-center">
      <h1 class="text-3xl font-bold">Login to Memoiz</h1>
      <form
        class="mt-8 flex flex-col items-center space-y-4"
        @submit.prevent="register"
      >
        <div class="flex h-48 flex-col gap-2">
          <UInputGroup label="Email" required>
            <UInput
              v-model="email"
              icon="i-heroicons-at-symbol"
              name="email"
              type="email"
              placeholder="memoiz@example.com"
            />
          </UInputGroup>
          <UInputGroup label="Password" required>
            <UInput
              v-model="password"
              icon="i-heroicons-lock-closed"
              name="password"
              type="password"
              placeholder="********"
            />
          </UInputGroup>
          <UInputGroup
            v-if="mode === Mode.REGISTER"
            label="Confirm Password"
            required
          >
            <UInput
              v-model="confirm"
              icon="i-heroicons-lock-closed"
              name="password"
              type="password"
              placeholder="********"
            />
          </UInputGroup>
        </div>
        <!-- Error box -->
        <div class="flex h-4 items-center">
          <span :class="cn(['text-red-500', 'dark:text-red-400'])">
            {{ error }}
          </span>
        </div>
        <UButton type="submit" color="primary">
          {{ mode === Mode.LOGIN ? "Login" : "Register" }}
        </UButton>
        <div class="flex items-center space-x-2">
          <span
            :class="
              cn([
                'cursor-pointer',
                'hover:text-primary-400 text-gray-400',
                'dark:hover:text-primary-400 dark:text-gray-400',
              ])
            "
            @click="
              {
                {
                  mode === Mode.LOGIN
                    ? (mode = Mode.REGISTER)
                    : (mode = Mode.LOGIN);
                }
              }
            "
          >
            {{
              mode === Mode.LOGIN
                ? "Don't have an account?"
                : "Already have an account?"
            }}
          </span>
        </div>
      </form>
    </div>
  </UContainer>
</template>

<style></style>
