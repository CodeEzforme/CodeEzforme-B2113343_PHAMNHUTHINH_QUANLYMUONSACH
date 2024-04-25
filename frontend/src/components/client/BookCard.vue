<template>
    <q-card class="my-card q-ma-sm my-box cursor-pointer q-hoverable" v-ripple style="width: 280px; height: 400px;">
        <div class="row justify-end"> <!-- Đặt icon bên phải của hàng -->
            <q-btn icon="fas fa-times" color="negative" class="icon-button" @click="deleteBook"/>
        </div>
        <div class="row justify-center full-height full-width text-center">
            <img :src="image" class="q-mt-sm" fit="contain" style="max-width: 170px; height: 200px;">
            <q-card-section class="text-left"> <!-- Đặt căn trái cho các thông tin -->
                <div class="text-h6">{{ name }}</div>
                <div class="text-subtitle-2">Tác giả: {{ author }}</div>
                <div class="text-subtitle-2">Giá: {{ cost }}đ</div>
                <div class="text-subtitle-2">Số Lượng: {{ quantity }}</div>
                <div class="text-subtitle-2">Năm xuất bản: {{ yearOfPublication }}</div>
            </q-card-section>
            <div class="row justify-center q-mt-md">
                <q-btn label="Cập Nhật" color="primary" @click="updateBook" class="update-button" />
            <!-- <q-btn label="X" color="negative" @click="deleteBook" class="q-ml-md" /> -->
            </div>
        </div>
    </q-card>
</template>

<script>
import axios from 'axios';
import router from '../router';
export default {
    props: {
        _id: String,
        name: String,
        author: String,
        cost: Number,
        quantity: Number,
        yearOfPublication: Number,
        // Add image prop
        image: String
    },
    methods: {
        updateBook() {
            router.push('/inventory/updatebook/' + this._id + '?name=' + this.name + '&author=' + this.author + '&cost=' + this.cost + '&quantity=' + this.quantity + '&yearOfPublication=' + this.yearOfPublication + '&image=' + this.image);
        },
        deleteBook() {
            axios.delete('http://localhost:3000/api/book/' + this._id)
                .then(response => {
                    location.reload();
                    this.$emit('book-deleted', this._id);
                })
                .catch(error => {
                    // Handle error
                    console.error(error);
                });
        }
    }
};
</script>
<style scoped>
.update-button {
    width: 150px; /* Thay đổi kích thước chiều dài theo mong muốn */
}
.icon-button {
    margin-right: 10px; /* Khoảng cách giữa icon và viền phải của card */
}
</style>