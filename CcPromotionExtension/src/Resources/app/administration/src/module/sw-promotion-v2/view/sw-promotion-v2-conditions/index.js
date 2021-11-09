import template from './sw-promotion-v2-conditions.html.twig';
import './sw-promotion-v2-conditions.scss';

const { Component } = Shopware;
const { Criteria, EntityCollection } = Shopware.Data;
const types = Shopware.Utils.types;

Component.override('sw-promotion-v2-conditions', {
    template,

    inject: [
        'repositoryFactory',
        'acl',
    ],

    data () {
        return {
            limit: 500,
            excludedPromotions: this.createPromotionCollection(),
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

            promotionRepository.search(criteria).then((excluded) => {
                this.excludedPromotions = excluded;
            });
        }
    }
});
