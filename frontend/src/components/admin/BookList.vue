<template>
    <ul class="list-group">
        <table class="table">
            <thead>
                <br>
                <tr>
                    <th>Tên</th>
                    <th>Giá</th>
                    <th>Quantity</th>
                    <th>Author</th>
                    <th>Thumbnail</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(book, index) in books" :key="book._id" :class="{ active: index === activeIndex }" @click="updateActiveIndex(index)">
                    <td>{{ book.bookTitle }}</td>
                    <td>{{ book.price }}</td>
                    <td>{{ book.quantity }}</td>
                    <td>{{ book.author }}</td>
                    <td>
                        <img :src="'http://localhost:3000/uploads/' + book.thumbnail" alt="Book Thumbnail" width="150" height="150">
                    </td>
                </tr>
            </tbody>
        </table>
    </ul>
</template>

<script>
    export default {
        props: {
            books: { type: Array, default: [] },
            activeIndex: { type: Number, default: -1 },
    },
    emits: ["update:activeIndex"],
        methods: {
            updateActiveIndex(index) {
                this.$emit("update:activeIndex", index);
            }
        }
    };
</script>

<style>
.img-book {
  padding: 20px;
  width: 12rem;
  height: auto;
  object-fit: cover;
}
.image-preview[src=""] {
  display: none;
}

/* CSS for table */
.table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}

.table th, .table td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.table th {
  background-color: #687eda;
}

/* Highlight active row */
.active {
  background-color: #f0f0f0;
}

/* Style for thumbnail */
.thumbnail-img {
  width: 50px;
  height: auto;
}

/* Optional: Style for action buttons */
.actions {
  display: flex;
  gap: 5px;
}



</style>