<template>
  <v-dialog v-model="dialog" width="400" v-if="!company.dayStarted">
    <template v-slot:activator="{ on }">
      <v-btn :color="`${company.mainColor}`" dark v-on="on" class="ml-4" small>
        Start Day
      </v-btn>
    </template>

    <v-card>
      <v-form ref="form">
        <v-text-field v-model="doughs" label="# of Doughs:" :color="`${company.mainColor}`"></v-text-field>
      </v-form>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn color="red" flat @click="dialog = false">
          Cancel
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click="dialog = false">
          Start Day
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      doughs: null
    }
  },
  props: {
    company: null
  }
}
</script>
