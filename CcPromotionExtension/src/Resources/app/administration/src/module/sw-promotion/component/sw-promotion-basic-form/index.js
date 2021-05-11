import template from './sw-promotion-basic-form.html.twig';
import './sw-promotion-basic-form.scss';

const { Component } = Shopware;
const { Criteria } = Shopware.Data;
const types = Shopware.Utils.types;

Component.override('sw-promotion-basic-form', {
    template,
    data () {
        return {
            limit: 500
        };
    },
    computed: {
        exclusionCriteria () {
            const criteria = this.$super('exclusionCriteria');
            criteria.setLimit(this.limit);
            return criteria;
        }
    },

    methods: {
        loadExclusions () {
            if (types.isEmpty(this.promotion.exclusionIds)) {
                this.excludedPromotions = this.createPromotionCollection();
                return;
            }

            const promotionRepository = this.repositoryFactory.create('promotion');
            const criteria = (new Criteria(1, this.limit)).addFilter(Criteria.equalsAny('id', this.promotion.exclusionIds));

            promotionRepository.search(criteria, Shopware.Context.api).then((excluded) => {
                this.excludedPromotions = excluded;
            });
        }
    }
});
