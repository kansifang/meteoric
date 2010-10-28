#include "string-lib.h"
int main()
{
	char **z;
	char *tmp;

	tmp = strdup("This is a demo. What kind of a demo is it?");
	z = explode(tmp, "demo");
        printf (": %s - %s - %s\n", z[0], z[1],z[2]);


	printf("---%s---\n",substr(tmp,0,1));
	
	printf("---%d---\n",countstr(tmp,""));

	printf ("Result:\n %s\n", replacestr(tmp, "demo", "DEMO"));

	printf ("-%s-\n",strrev(tmp));

        free(z[0]);
	free (z);

	return 1;
}
