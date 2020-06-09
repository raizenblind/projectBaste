<template>
    <GridLayout class="main-page">
        <StackLayout class="table"> 
            <FlexboxLayout class="t-header">
                <Label class="t-header-label" text="Order Number" width="30%"  textWrap="true"/>
                
                <Label class="t-header-label"  text="Price" width="25%"  textWrap="true"/>
                
                <Label class="t-header-label" text="Date" width="25%" extWrap="true" />
                <Label class="t-header-label" text="" width="20%"  textWrap="true" borderRightWidth="0"/>
            </FlexboxLayout>

            <ScrollView height="100%">
                <StackLayout>
                    <FlexboxLayout>
                        <Label class="t-data" text="1" width="30%"  textWrap="true"/>
                        <!-- <Label class="t-data" :text="productList.description" width="20%"  textWrap="true"/> -->
                        <Label class="t-data" :text="'₱' " width="25%"  textWrap="true"/>
                        
                        <Label class="t-data" text="Inactive" width="25%" textWrap="true" />
                        <Label  class="t-data fa" width="20%" :text="'\uf06e'"  textWrap="true"  fontSize="20" textAlignment="center"/>

                    </FlexboxLayout>
                </StackLayout>
            </ScrollView>
        </StackLayout>
        

    </GridLayout>
    
</template>