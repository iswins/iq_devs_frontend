<template>

  <div class="center-form">


    <div class="div-center">
      <div class="content">
        <h3>Registration</h3>
        <div class="alert alert-danger" v-if="error" v-html="error"></div>
        <hr />
        <form>
          <div class="mb-3">
            <label for="companyInn">INN</label>
            <input type="number" class="form-control" v-model="form.inn" id="companyInn" placeholder="Email">
          </div>
          <div class="mb-3">
            <label for="exampleInputEmail1">Email address</label>
            <input type="email" class="form-control" v-model="form.email" id="exampleInputEmail1" placeholder="Email">
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1">Password</label>
            <input type="password" class="form-control" v-model="form.password" id="exampleInputPassword1" placeholder="Password">
          </div>

          <button v-if="!process" type="submit" @click="login" class="btn btn-primary">Login</button>
          <div v-else class="spinner-border text-success" role="status">
            <span class="sr-only"></span>
          </div>

          <hr />
          <router-link class="btn btn-link" to="/login">Login</router-link>
        </form>
      </div>
    </div>
  </div>
</template>

<script>

import api from "../library/Api";

export default {
  data() {
    return {
      error: null,
      process: false,
      form: {
        inn: null,
        email: null,
        password: null
      }
    }
  },

  methods: {
    login() {
      this.error = null;
      this.process = true;

      api.register(this.form.inn, this.form.email, this.form.password)
          .then(response => {
            this.process = false;
            this.$router.push('/');
          })
          .catch(error => {
            this.process = false;
            this.error = error.getMessage();
          });

    }
  }
}
</script>
