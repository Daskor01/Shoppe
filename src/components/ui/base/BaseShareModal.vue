<template>
  <div class="share">
    <div v-if="isOpen" class="share-overlay" @click="close" />

    <div class="share-modal" :class="{ 'share-modal--active': isOpen }">
      <div class="share-modal__handle"></div>

      <h3 class="share-modal__title">To share</h3>

      <div class="share-modal__grid">
        <button
          v-for="(social, index) in socialNetworks"
          :key="index"
          class="share-modal__button"
          @click="share(social)"
        >
          <component :is="social.icon" />
          <span class="share-modal__label">{{ social.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { socialNetworks } from '@/config/navigation'

  defineProps({
    isOpen: Boolean,
  })

  const emit = defineEmits(['close'])

  const share = (social) => {
    const shareText = 'Look at this product!'
    const url = window.location.href

    if (social.name === 'Message') {
      const smsUrl = `sms:?body=${encodeURIComponent(shareText + ' ' + url)}`
      window.location.href = smsUrl
    } else {
      let shareUrl
      if (social.name === 'Twitter') {
        shareUrl = `${social.shareUrl}${encodeURIComponent(shareText + ' ' + url)}`
      } else {
        shareUrl = `${social.shareUrl}${encodeURIComponent(url)}`
      }

      window.location.href = shareUrl

      setTimeout(() => {
        if (!document.hidden) {
          switch (social.name) {
            case 'Facebook':
              window.open(
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
                '_blank',
              )
              break
            case 'Twitter':
              window.open(
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
                '_blank',
              )
              break
            case 'Instagram':
              copyToClipboard(url)
              break
          }
        }
      }, 500)
    }

    close()
  }

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert('The link has been copied to the clipboard!')
      })
      .catch((err) => {
        console.error('Error when copying: ', err)
      })
  }

  const close = () => {
    emit('close')
  }
</script>

<style scoped lang="scss">
  .share-overlay {
    position: fixed;
    inset: 0;
    z-index: 999;
    background-color: rgb(0 0 0 / 50%);
  }

  .share-modal {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    padding: 16px;
    background-color: #fff;
    border-radius: 16px 16px 0 0;
    transform: translateY(100%);
    transition: transform 0.3s ease-out;

    &--active {
      transform: translateY(0);
    }

    &__handle {
      width: 40px;
      height: 4px;
      margin: 0 auto 16px;
      background-color: #ddd;
      border-radius: 2px;
    }

    &__title {
      margin-bottom: 20px;
      font-size: 18px;
      font-weight: 600;
      color: #333;
      text-align: center;
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;

      @media (max-width: vars.$breakpoints-s) {
        grid-template-columns: repeat(4, 1fr);
      }

      @media (max-width: vars.$breakpoints-xs) {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }
    }

    &__button {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0;
      cursor: pointer;
      background: none;
      border: none;

      &:hover {
        opacity: 0.8;
      }
    }

    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      margin-bottom: 8px;
      font-size: 20px;
      background-color: #f5f5f5;
      border-radius: 50%;
    }

    &__label {
      font-size: 12px;
      color: #666;
    }
  }
</style>
