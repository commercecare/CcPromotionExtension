import template from './cc-entity-multi-select.html.twig';

const { Component } = Shopware;
const { EntityCollection } = Shopware.Data;

Component.extend('cc-entity-multi-select', 'sw-entity-multi-select', {
    template,
    computed: {
        selectToggleClass () {
            return this.currentCollection
            && this.resultCollection
            && this.currentCollection.length === this.resultCollection.length
                ? 'small-default-checkmark-square'
                : 'small-default-square';
        }
    },
    methods: {
        isExpanded () {
            if (!this.$refs.selectBase || this.isLoading || !this.resultCollection || !this.resultCollection.length) {
                return false;
            }
            return this.$refs.selectBase.expanded;
        },
        selectToggle () {
            if (!this.resultCollection || !this.resultCollection.length) {
                return;
            }

            const newCollection = this.currentCollection && this.currentCollection.length === this.resultCollection.length
                ? this.unselectAll()
                : this.selectAll();

            this.emitChanges(newCollection);

            this.$refs.selectionList.focus();
            this.$refs.selectionList.select();
        },
        selectAll () {
            const newCollection = EntityCollection.fromCollection(this.currentCollection);
            this.resultCollection.forEach((item) => {
                if (this.isSelected(item)) {
                    return;
                }
                this.$emit('item-add', item);
                newCollection.add(item);
            });
            return newCollection;
        },
        unselectAll () {
            this.resultCollection.forEach((item) => {
                if (!this.isSelected(item)) {
                    return;
                }
                this.$emit('item-remove', item);
            });
            return EntityCollection.fromCollection([]);
        }
    }
});
