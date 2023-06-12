# Week 1 (June 1-7)

## Meeting
- Share repo
- Share original project
- Share number

## Task 
 [✔️] Check M extension => Done 
    Found no erros for M extension, and June revision updated.

## Exercises

1. Decode:  
    1. ```0x01e007ef``` -> ```jal a5 30```✔️
    2. ```0x0001e7b7``` -> ```lui a5 30```✔️                                                          
    3. ```0x00440113``` -> ```addi sp, s0, 4```✔️                                                             
    4. ```0x40445113``` -> ```srai sp, s0, 4```✔️                                                             
    5. ```0x403100b3``` -> ```sub ra, sp, gp```✔️                                                             
    6. ```0xfea64ae3``` -> ```blt x12 x10 -12```✔️                                
    7. ```0x0003a583``` -> ```lw a1 0(t2)```✔️                                                                 
    8. ```0x00b3a023``` -> ```sw a1 0(t2)```✔️

2. Encode
    1. ```j -12``` -> ```0xff5ff06f```✔️                                                                   
    2. ```auipc sp 8``` -> ```0x00008117```✔️                                                              
    3. ```andi sp, s0, 4``` -> ```0x00447113```✔️                                                            
    4. ```sltiu sp, s0, 4``` -> ```0x00443113```✔️                                                              
    5. ```or ra, sp, gp``` -> ```0x003160b3```✔️                                                                    
    6. Only the jump instruction of the following program
        - ```<LABEL>```  
        - &nbsp;&nbsp;&nbsp;&nbsp;```lw a1 0(t2)```   
        - &nbsp;&nbsp;&nbsp;&nbsp;```add a2 a1 a1```  
        - &nbsp;&nbsp;&nbsp;&nbsp;```sw a1 0(t2)```  
        - &nbsp;&nbsp;&nbsp;&nbsp;```bgtz sp <LABEL>``` -> ```0xfe204ae3```                                
    7. ```lw a7 8(t2)``` -> ```0x0083a883```✔️                                                                  
    8. ```sw a7 8(t2)``` -> ```0x0113a423```✔️