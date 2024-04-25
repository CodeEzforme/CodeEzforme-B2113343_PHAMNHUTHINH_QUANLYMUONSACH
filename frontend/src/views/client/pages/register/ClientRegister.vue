<template>
  <div>
    <ClientAppHeader />

    <div class="container mt-3 mb-3">
      <div class="add-new">Đăng kí tài khoản</div>
      <div class="form">
        <form @submit.prevent="add" action="">
          <div class="form-item">
            <label class="label" for="fullName">Họ và tên:</label><br />
            <input
              class="input"
              type="text"
              id="fullName"
              v-model="formData.fullName"
            />
          </div>
          <div class="form-item">
            <label class="label" for="email">Email:</label><br />
            <input
              class="input"
              type="email"
              id="email"
              v-model="formData.email"
            />
          </div>
          <div class="form-item">
            <label class="label" for="password">Password:</label><br />
            <input
              class="input"
              type="password"
              id="password"
              v-model="formData.password"
            />
          </div>

          <div class="form-item">
            <label class="label" for="address">Địa chỉ:</label><br />
            <input
              class="input"
              type="text"
              id="address"
              v-model="formData.address"
            />
          </div>

          <div class="form-item">
            <label class="label" for="phone">Số điện thoại:</label><br />
            <input
              class="input"
              type="text"
              id="phone"
              v-model="formData.phone"
            />
          </div>

          <button type="submit" class="btn btn-primary">Tạo</button>
        </form>
      </div>
    </div>
  </div>
</template>
  
  <script>
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import ClientAppHeader from "@/components/client/ClientAppHeader.vue";
import ReaderService from "@/services/client/reader.service";

export default {
  components: {
    ClientAppHeader,
  },
  data() {
    return {
      formData: {
        fullName: "",
        email: "",
        password: "",
        address: "",
        phone: "",
      },
    };
  },

  computed: {},

  methods: {
    async add() {
      try {
        if (
          !this.formData.fullName ||
          !this.formData.email ||
          !this.formData.password
        ) {
          toast.error("Please fill in all required fields.", {
            autoClose: 3000,
          });
          return;
        }

        const formData = new FormData();
        formData.append("fullName", this.formData.fullName);
        formData.append("email", this.formData.email);
        formData.append("password", this.formData.password);
        formData.append("address", this.formData.address);
        formData.append("phone", this.formData.phone);

        const response = await ReaderService.create(this.formData);
        toast.success("Added successfully!", {
          autoClose: 1200,
        });

        setTimeout(() => {
          this.$router.push({ name: "login-client" });
        }, 800);
      } catch (error) {
        console.log(error);
        const errorMessage = error.response?.data?.error || "Error!";
        toast.error(errorMessage, { autoClose: 3000 });
      }
    },
  },
};
</script>
  
  <style scoped>
.container {
  width: 80%;
  width: 500px;
  height: 600px;
  text-align: center;
  padding: 20px;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.add-new {
  font-size: 30px;
  margin-bottom: 20px;
}

.form-item {
  text-align: left;
  padding: 10px;
}

.label {
  font-weight: bold;
}

.input {
  width: 100%;
  /* height: 40px; */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
  