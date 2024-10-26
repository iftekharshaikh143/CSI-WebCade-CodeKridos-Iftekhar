#include<stdio.h>
#include<stdlib.h>
#include<stdbool.h>

int queue[5];
int f = -1, r = -1;

bool isEmpty()
{
    if(f == -1 && r == -1)
    {
        return true;
    }
    return false;
}

bool isFull()
{
    if(r == 4)
    {
        return true;
    }
    return false;
}

void enQueue(int x)
{
    if(isFull())
    {
        printf("\nQueue Is Full");
        return;
    }
    else if(isEmpty())
    {
        f = r = 0;
    }
    else
    {
        r++;
    }
    queue[r] = x;

    printf("\nValue Inserted Successfully\n");
}

void deQueue()
{
    int x;

    if(isEmpty())
    {
        printf("\nQueue Is Empty");
        return ;
    }
    else
    {
        x = queue[f];

        if(f == r)
        {
            f = r = -1;
        }
        else
        {
            f++;
        }

        printf("\nValue Deleted Successfully\n");
    }
}

void front()
{
    if(isEmpty())
    {
        printf("\nQueue Is Empty");
    }
    else
    {
        printf("\nFront Value Is %d\n", queue[f]);
    }
}

void display()
{
    if(isEmpty())
    {
        printf("\nQueue Is Empty");
        return;
    }
    else
    {
        printf("\nDisplaying The Values Present In Queue:\n");
        for(int i = f; i <= r; i++)
        {
            printf("%d\t", queue[i]);
        }
        printf("\n");
    }
}

int main()
{
    int ch, x;
    while(1)
    {
        printf("\nQUEUE OPERATIONS\n");
        printf("1.ENQUEUE\n");
        printf("2.DEQUEUE\n");
        printf("3.FRONT\n");
        printf("4.DISPLAY\n");
        printf("5.EXIT\n");
        printf("\nSELECT YOUR CHOICE\n");
        scanf("%d", &ch);
        switch(ch)
        {
            case 1:
                printf("\nEnter A Value:\n");
                scanf("%d", &x);
                enQueue(x);
                break;

            case 2:
                deQueue();
                break;

            case 3:
                front();
                break;

            case 4:
                display();
                break;

            case 5:
                exit(0);

            default:
                printf("\nWARNING INVALID CHOICE!! TRY AGAIN\n");
                break;
        }
    }
    return 0;
}
