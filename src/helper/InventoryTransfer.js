

export const Transfer = {
    TYPE_REFILL_DISTRIBUTION: 'Refill Distribution',
    TYPE_EXPIRED_RETURN: 'Expired Return',
    TYPE_EXCESS_RETURN: 'Excess Return',
    TYPE_ADDITIONAL_DISTRIBUTION: 'Additional Distribution',
    TYPE_DAMAGE_RETURN : 'Damage Return',
    TYPE_REFILL_DISTRIBUTION_VALUE: 1,
    TYPE_EXPIRED_RETURN_VALUE: 2,
    TYPE_EXCESS_RETURN_VALUE: 3,
    TYPE_ADDITIONAL_DISTRIBUTION_VALUE:4,
    TYPE_DAMAGE_RETURN_VALUE: 5,
    STATUS_DRAFT: "Draft",
    STATUS_COMPLETED: "Completed",
    STATUS_REVIEW : "Review"
}

export const changeType = (data) => {
    if (data == Transfer.TYPE_EXPIRED_RETURN) {
        return Transfer.TYPE_EXCESS_RETURN_VALUE
    }
    if (data == Transfer.TYPE_REFILL_DISTRIBUTION) {
        return Transfer.TYPE_REFILL_DISTRIBUTION_VALUE
    }
    if (data == Transfer.TYPE_EXCESS_RETURN) {
        return Transfer.TYPE_EXPIRED_RETURN_VALUE
    }
    if (data ==  Transfer.TYPE_DAMAGE_RETURN) {
        return Transfer.TYPE_DAMAGE_RETURN_VALUE
    }
    if (data == Transfer.TYPE_ADDITIONAL_DISTRIBUTION) {
        return Transfer.TYPE_ADDITIONAL_DISTRIBUTION_VALUE
    }
}

export const TypeOptions = [
{
    label: Transfer.TYPE_REFILL_DISTRIBUTION,
    value: Transfer.TYPE_REFILL_DISTRIBUTION_VALUE
}, 
{
    label: Transfer.TYPE_ADDITIONAL_DISTRIBUTION,
    value: Transfer.TYPE_ADDITIONAL_DISTRIBUTION_VALUE
}, 
{
    label: Transfer.TYPE_EXCESS_RETURN,
    value: Transfer.TYPE_EXPIRED_RETURN_VALUE
}, 
{
    label: Transfer.TYPE_EXPIRED_RETURN,
    value: Transfer.TYPE_EXCESS_RETURN_VALUE
},
{
    label: Transfer.TYPE_DAMAGE_RETURN,
    value: Transfer.TYPE_DAMAGE_RETURN_VALUE
}
]