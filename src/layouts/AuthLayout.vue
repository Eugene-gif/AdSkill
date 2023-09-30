<script setup></script>

<template>
  <q-layout view="lHh Lpr lff">
    <q-page-container>
      <q-page
        class="form"
        style="padding: 24px"
      >
        <div class="row form-box">
          <div class="col-6 box1 box">
            <img
              class="box__logo"
              src="/img/icons/logo.svg"
              alt="logo"
            />
            <img
              class="box__img"
              src="/img/pictures/illustration.png"
              alt="image"
            />
            <div class="slogan">
              <h2 class="title">Future of marketing</h2>
              <p class="text">
                Lorem Ipsum is simply dummy text of the printing and
                typesetting industry. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s,
                when an unknown printer took a galley of type and
                scrambled it to make a type specimen book.
              </p>
            </div>
          </div>

          <div class="column col-6 box2 box">
            <router-view />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style lang="scss" scoped>
  @import "@/layouts/styles/_AuthLayout.scss";
</style>
