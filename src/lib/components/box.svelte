<script lang="ts">
    export let color = 'orange';
    export let borderWidth = '2px';
    export let radius = '0px';
</script>

<div
    class="box"
    style:border-color={color}
    style:border-width={borderWidth}
    style:border-radius={radius}
>
    <slot />
</div>

<style>
    .box {
        border-style: solid;
        display: inline-block;
        width: fit-content;
        height: fit-content;
    }
</style>
