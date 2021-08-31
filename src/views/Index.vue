<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-white">
      <a class="navbar-brand" href="/">
        <img src="https://hhcdn.ru/employer-logo/3794196.jpeg" width="60" height="60" alt="">
      </a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav" v-if="user">
          <li class="nav-item">
            <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">{{user.name}}</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" @click="logout($event)">Выход</a>
          </li>
        </ul>
      </div>
    </nav>



    <div class="container">
        <div class="row">
          <div class="col-md-6">
            <div class="panel panel-default">
              <div class="panel-heading">New order</div>
              <div class="panel-body">
                <div class="alert alert-danger" v-if="error" v-html="error"></div>
                <form>
                  <div class="mb-3">
                    <label for="amount">Amount</label>
                    <input type="number" min="100000" max="100000000" class="form-control" id="amount" v-model="form.amount" aria-describedby="emailHelp">
                  </div>
                  <div class="mb-3">
                    <label for="term">Term</label>
                    <select class="form-select form-select-lg mb-3" v-model="form.term" aria-label=".form-select-lg example">
                      <option selected>Select load term</option>
                      <option value="12">12 months</option>
                      <option value="24">24 months</option>
                      <option value="36">36 months</option>
                      <option value="48">48 months</option>
                      <option value="60">60 months</option>
                    </select>

                    <input type="number" min="1" max="120" class="form-control" v-model="form.term" id="term">
                  </div>
                  <button type="submit" v-if="!process" @click="newOrder" class="btn btn-primary">Create</button>
                  <div v-else class="spinner-border text-success" role="status">
                    <span class="sr-only"></span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <hr />

      <div class="row">
        <div class="col-md-12">
            <button type="button" class="btn btn-success" @click="loadOrders()">Update table</button>
        </div>
      </div>

      <hr />

      <div class="row">
        <div class="col-md-12 table-container" :class="{preload: processTable}">
            <table class="table table-bordered table-striped table-hover table-dark">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Term (Months)</th>
                    <th>Status</th>
                    <th>Product</th>
                    <th>Scoring rate</th>
                    <th>Payments</th>
                  </tr>
                </thead>
                <tbody v-if="orders && orders.length > 0">
                  <tr v-for="order in orders">
                      <td>
                        {{order.id}}
                      </td>
                      <td>
                        {{order.date}}
                      </td>
                      <td>
                        {{order.amount.toLocaleString()}}
                      </td>
                      <td>
                        {{order.term}}
                      </td>
                      <td>
                        <span v-if="order.status" :style="{color: order.status.color}">{{order.status.name}}</span>
                      </td>
                      <td>
                          <span v-if="order.product">
                            {{order.product.name}} ({{order.product.credit_rate}}%)
                          </span>
                      </td>
                      <td>
                        {{order.rate}}
                      </td>
                      <td>
                        <a href="#" @click="detailOrder($event, order.id)">Show payments</a>
                      </td>
                  </tr>
                </tbody>
            </table>
        </div>
      </div>
    </div>

    <b-modal
        id="modal-details"
        ref="modal"
        title="Payments"
    >
      <table class="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th>
                Date
              </th>
              <th>
                Loan percent
              </th>
              <th>
                Load body
              </th>
              <th>
                Amount
              </th>
            </tr>
          </thead>
          <tbody v-if="details">
              <tr v-for="detail in details">
                  <td>{{detail.date}}</td>
                  <td>{{detail.percent.toLocaleString()}}</td>
                  <td>{{detail.body.toLocaleString()}}</td>
                  <td>{{detail.amount.toLocaleString()}}</td>
              </tr>
          </tbody>
      </table>
    </b-modal>

  </div>
</template>


<script>

  import api from "../library/Api";
  import { BModal } from 'bootstrap-vue'

  export default {
    components: {
      BModal
    },
    componentName: 'index',
    data() {
      return {
        process: false,
        processTable: false,
        error: null,
        user: null,
        orders: null,
        details: null,
        form: {
          amount: 0,
          term: 0
        }
      }
    },
    methods: {
      logout($event) {
          $event.preventDefault();
          api.logout()
            .then(response => {
                this.$router.push('/login');
            })
            .catch(error => {
                alert(error.getMessage());
            });
      },
      loadUser() {
          api.getCurrentUser()
            .then(response => {
              this.user = response;
            })
            .catch(error => {
                alert(error.getMessage());
            });
      },

      loadOrders() {
        this.processTable = true;
        api.listOrders()
          .then(response => {
              this.orders = response;
              this.processTable = false;
          })
          .catch(error => {
              this.processTable = false;
              alert(error.getMessage());
          });
      },


      newOrder() {
        this.error = null;
        this.process = true;
        api.newOrder(this.form.amount, this.form.term)
            .then(response => {
              this.process = false;
              this.loadOrders();
            })
            .catch(error => {
              this.process = false;
              this.error = error.getMessage();
            });
      },


      detailOrder($event, orderId) {
        this.details = null;
        this.$bvModal.show('modal-details');
        $event.preventDefault();

        api.detailOrder(orderId)
        .then(response => {
          this.details = response;
        })
        .catch(error => {
          alert(error.getMessage());
        })
      }

    },
    mounted() {
      this.loadUser();
      this.loadOrders();
    }
  }
</script>
